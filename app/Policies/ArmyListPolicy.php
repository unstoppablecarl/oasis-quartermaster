<?php

namespace App\Policies;

use App\Models\ArmyList;
use App\Models\User;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ArmyListPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, ArmyList $armyList): bool
    {
        if ($this->isOwner($user, $armyList)) {
            return true;
        }

        if ($armyList->public) {
            return true;
        }

        throw new NotFoundHttpException;
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

    protected function isOwner(?User $user, ArmyList $armyList): bool
    {
        if (!$user) {
            return false;
        }

        return $armyList->user_id === $user->id;
    }
}
