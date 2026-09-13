<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreArmyListRequest;
use App\Http\Requests\UpdateArmyListRequest;
use App\Http\Resources\ArmyListResource;
use App\Models\ArmyList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ArmyListController
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', ArmyList::class);
        $armyLists = $request->user()->armyLists()->get();

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
        $armyList->fill($request->validated());
        $armyList->user_id = $request->user()->id;
        $armyList->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Army list created']);

        return redirect()->route('army-lists.show', $armyList);
    }

    public function show(ArmyList $armyList)
    {
        Gate::authorize('view', $armyList);

        $data = [
            'armyList' => $armyList->toResource(),
        ];

        return Inertia::render('ArmyLists/Show', $data);
    }

    public function edit(ArmyList $armyList)
    {
        Gate::authorize('update', $armyList);

        $data = [
            'armyList' => $armyList->toResource(),
        ];

        return Inertia::render('ArmyLists/Edit', $data);
    }

    public function update(UpdateArmyListRequest $request, ArmyList $armyList)
    {
        Gate::authorize('update', $armyList);

        $armyList->update($request->all());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Army List Updated']);

        return redirect()->route('army-lists.edit', $armyList);
    }

    public function destroy(ArmyList $armyList)
    {
        Gate::authorize('delete', $armyList);

        $armyList->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Army List Deleted']);

        return redirect()->route('army-lists.index');
    }
}
