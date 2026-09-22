<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreArmyListRequest;
use App\Http\Requests\UpdateArmyListRequest;
use App\Http\Resources\ArmyListResource;
use App\Models\ArmyList;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ArmyListController
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', ArmyList::class);
        $armyLists = $request->user()->armyLists()->with('armyListType', 'units', 'commands')->get();

        $resourceCollection = ArmyListResource::collection($armyLists);

        $data = [
            'armyLists' => $resourceCollection,
        ];

        return Inertia::render('ArmyLists/Index', $data);
    }

    public function create()
    {
        Gate::authorize('create', ArmyList::class);

        return Inertia::render('ArmyLists/Create');
    }

    public function store(StoreArmyListRequest $request)
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

    public function show(ArmyList $armyList)
    {
        Gate::authorize('view', $armyList);

        $data = [
            'armyList' => $armyList->load(['units', 'armyListType', 'commands'])->toResource(),
        ];

        return Inertia::render('ArmyLists/Show', $data);
    }

    public function edit(ArmyList $armyList)
    {
        Gate::authorize('update', $armyList);

        $data = [
            'armyList' => $armyList->load(['units', 'armyListType', 'commands'])->toResource(),
        ];

        return Inertia::render('ArmyLists/Edit', $data);
    }

    public function update(UpdateArmyListRequest $request, ArmyList $armyList)
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

    public function destroy(ArmyList $armyList)
    {
        Gate::authorize('delete', $armyList);

        $armyList->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Army List Deleted']);

        return redirect()->route('army-lists.index');
    }

    public function print(ArmyList $armyList)
    {
        Gate::authorize('view', $armyList);

        $data = [
            'armyList' => $armyList->load(['units', 'armyListType', 'commands'])->toResource(),
        ];

        return Inertia::render('ArmyLists/Print', $data);
    }

    /**
     * @return Collection<int, array{quantity: int, display_order: int}>
     */
    private function unitsForSync(StoreArmyListRequest $request)
    {
        return collect($request->safe()->array('units'))
            ->values()
            ->mapWithKeys(fn (array $unit, int $index) => [$unit['id'] => [
                'quantity' => $unit['quantity'],
                'display_order' => $index,
            ]]);
    }

    /**
     * @return Collection<int, int>
     */
    private function commandsForSync(StoreArmyListRequest $request)
    {
        return collect($request->safe()->array('commands'))
            ->pluck('id');
    }
}
