<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreArmyListRequest;
use App\Http\Requests\UpdateArmyListRequest;
use App\Http\Resources\ArmyListResource;
use App\Models\ArmyList;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ArmyListController
{
    public const string DEFAULT_PRINT_MODE = 'list';

    public const array OTHER_PRINT_MODES = ['cards', 'faction-and-command-cards'];

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', ArmyList::class);
        $armyLists = $request->user()->armyLists()->with('armyListType', 'units', 'commands')->get();

        $resourceCollection = ArmyListResource::collection($armyLists);

        $data = [
            'armyLists' => $resourceCollection,
        ];

        return Inertia::render('ArmyLists/Index', $data);
    }

    public function create(): Response
    {
        Gate::authorize('create', ArmyList::class);

        return Inertia::render('ArmyLists/Create');
    }

    public function draftShow(): Response
    {
        return Inertia::render('ArmyLists/Draft/Show');
    }

    public function draftEdit(): Response
    {
        return Inertia::render('ArmyLists/Create');
    }

    public function draftPrint(string $mode = self::DEFAULT_PRINT_MODE): Response
    {
        return Inertia::render('ArmyLists/Draft/Print', [
            'printMode' => $mode,
        ]);
    }

    public function store(StoreArmyListRequest $request): RedirectResponse
    {
        Gate::authorize('create', ArmyList::class);

        $armyList = new ArmyList;
        $armyList->fill($request->safe()->only([
            'display_name',
            'army_list_type_id',
            'custom_max_points',
            'faction_id',
            'public',
        ]));
        $armyList->user_id = $request->user()->id;
        $armyList->save();

        $armyList->units()->sync($this->unitsForSync($request));
        $armyList->commands()->sync($this->commandsForSync($request));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Army list created']);

        return redirect()->route('army-lists.edit', $armyList);
    }

    public function show(ArmyList $armyList): Response
    {
        Gate::authorize('view', $armyList);

        $data = [
            'armyList' => $armyList->load(['units', 'armyListType', 'commands'])->toResource(),
        ];

        return Inertia::render('ArmyLists/Show', $data);
    }

    public function edit(ArmyList $armyList): Response
    {
        Gate::authorize('update', $armyList);

        $data = [
            'armyList' => $armyList->load(['units', 'armyListType', 'commands'])->toResource(),
        ];

        return Inertia::render('ArmyLists/Edit', $data);
    }

    public function update(UpdateArmyListRequest $request, ArmyList $armyList): JsonResponse
    {
        Gate::authorize('update', $armyList);

        $armyList->update($request->safe()->only([
            'display_name',
            'army_list_type_id',
            'custom_max_points',
            'faction_id',
            'public',
        ]));

        $armyList->units()->sync($this->unitsForSync($request));
        $armyList->commands()->sync($this->commandsForSync($request));

        return response()->json([
            'armyList' => $armyList->load(['units', 'armyListType', 'commands'])->toResource(),
            'message' => 'Army List Updated',
        ]);
    }

    public function destroy(ArmyList $armyList): RedirectResponse
    {
        Gate::authorize('delete', $armyList);

        $armyList->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Army List Deleted']);

        return redirect()->route('army-lists.index');
    }

    public function duplicate(Request $request, ArmyList $armyList): RedirectResponse
    {
        Gate::authorize('view', $armyList);
        Gate::authorize('create', ArmyList::class);

        $armyList->loadMissing(['units', 'commands']);

        $duplicate = $armyList->replicate(['uuid']);
        $duplicate->display_name = "{$armyList->display_name} (Copy)";
        $duplicate->user_id = $request->user()->id;
        $duplicate->public = false;
        $duplicate->save();

        $duplicate->units()->sync(
            $armyList->units->mapWithKeys(fn ($unit) => [$unit->id => [
                'quantity' => $unit->pivot->quantity,
                'display_order' => $unit->pivot->display_order,
            ]])
        );
        $duplicate->commands()->sync($armyList->commands->pluck('id'));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Army List Duplicated']);

        return redirect()->route('army-lists.edit', $duplicate);
    }

    public function print(ArmyList $armyList, string $mode = self::DEFAULT_PRINT_MODE): Response
    {
        Gate::authorize('view', $armyList);

        $data = [
            'armyList' => $armyList->load(['units', 'armyListType', 'commands'])->toResource(),
            'printMode' => $mode,
        ];

        return Inertia::render('ArmyLists/Print', $data);
    }

    /**
     * @return Collection<int, array{quantity: int, display_order: int}>
     */
    private function unitsForSync(StoreArmyListRequest $request): Collection
    {
        return collect($request->safe()->array('units'))
            ->values()
            ->mapWithKeys(fn (array $unit, int $index) => [(int) $unit['id'] => [
                'quantity' => (int) $unit['quantity'],
                'display_order' => $index,
            ]]);
    }

    /**
     * @return Collection<int, int>
     */
    private function commandsForSync(StoreArmyListRequest $request): Collection
    {
        return collect($request->safe()->array('commands'))
            ->pluck('id');
    }
}
