<?php

namespace App\Policies;

use App\Models\ArmyList;
use App\Models\User;

class ArmyListPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, ArmyList $armyList): bool
    {
        return $this->isOwner($user, $armyList);
    }

    public function create(?User $user): bool
    {
        return true;
    }

    public function update(User $user, ArmyList $armyList): bool
    {
        return $this->isOwner($user, $armyList);
    }

    public function delete(User $user, ArmyList $armyList): bool
    {
        return $this->isOwner($user, $armyList);
    }

    protected function isOwner(User $user, ArmyList $armyList): bool
    {
        return $armyList->user_id === $user->id;
    }
}
