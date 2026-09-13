<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
</script>

<template>
    <Head title="Rules" />

    <div class="card card-rules">
        <div class="card-body">

            <p class="note" style="margin-top:0">Condensed rules reference — mechanics only, no glossary or diagrams.
                See
                the full rulebook for flavor text, examples, and illustrations.</p>

            <div class="card" id="rules-menu">
                <div class="card-body">
                    <h3>Contents</h3>
                    <ol class="rules-toc">
                        <li><a href="#rule-objective">Objective</a></li>
                        <li><a href="#rule-setup">Setup</a></li>
                        <li><a href="#rule-turn-structure">Turn Structure</a></li>
                        <li><a href="#rule-moving">Moving</a></li>
                        <li><a href="#rule-terrain">Terrain</a></li>
                        <li><a href="#rule-attacking">Attacking</a></li>
                        <li><a href="#rule-los-cover">Line of Sight &amp; Cover</a></li>
                        <li><a href="#rule-damage">Rolling Attacks &amp; Damage</a></li>
                        <li><a href="#rule-commands">Commands</a></li>
                        <li><a href="#rule-salvage">Finding Salvage</a></li>
                        <li><a href="#rule-winning">Winning</a></li>
                    </ol>
                </div>
            </div>

            <div class="rule-section" id="rule-objective">
                <h4>Objective</h4>
                <p>Extract 3 Salvage tokens before your opponents, or eliminate all opposing forces.</p>
                <a class="back-to-top" href="#rules-menu">↑ Contents</a>
            </div>

            <div class="rule-section" id="rule-setup">
                <h4>Setup</h4>
                <ul>
                    <li>400 points per force, 20 units max, no more than 10 of any one unit type.</li>
                    <li>Must include at least one unit with the Surveyor trait and one with the Transport trait.</li>
                    <li>Each force gets 2 Command cards.</li>
                    <li>Standard table: 36"×72", with 8+ pieces of stackable terrain.</li>
                    <li>Place 1 Major Point of Interest at the table center, then 4 Minor Points of Interest — each 24"+
                        from the short table edges and 6"+ from any other Point.
                    </li>
                    <li>Deploy units in the 6"×36" zones on opposite short edges: highest <a class="rule-term"
                                                                                             href="#rule-turn-structure">initiative</a>
                        value places first, all of a player's units at one value before the opponent places theirs at
                        that
                        value, then proceed to the next-lowest value.
                    </li>
                    <li>After all units are placed, each side places 2 Collection Beacons in their deployment zone.</li>
                </ul>
                <a class="back-to-top" href="#rules-menu">↑ Contents</a>
            </div>

            <div class="rule-section" id="rule-turn-structure">
                <h4>Turn Structure</h4>
                <p><b>Initiative Bid:</b> both players secretly set a D20 to a value 0–20 — the face-up number is your
                    remaining command points for the turn (20 minus your bid). Reveal simultaneously; lower bid wins and
                    chooses who activates first at each tied initiative value. Ties: both rebid, but can't repeat their
                    previous bid.</p>
                <p><b>Activation:</b> units activate in descending initiative order. All units at a given value (both
                    players combined) activate before moving to the next-lowest value; the bid winner chooses activation
                    order within each tied value. While active, a unit may Move once, Survey once, and use every Weapon
                    and
                    Ability once (unless stated otherwise), in any order. Beacons may be declared active before the
                    first
                    unit activates each turn.</p>
                <p><b>Reset:</b> once every unit has activated, command points reset to 20 for next turn's initiative
                    bid,
                    and no further commands may be used.</p>
                <a class="back-to-top" href="#rules-menu">↑ Contents</a>
            </div>

            <div class="rule-section" id="rule-moving">
                <h4>Moving</h4>
                <ul>
                    <li>Move up to your Move stat (inches), straight or curved, once per activation. Measuring
                        range/distance is allowed at any time.
                    </li>
                    <li>May attack before moving, after moving, or split attacks across both if you have multiple
                        weapons.
                    </li>
                    <li>After moving, face any direction.</li>
                    <li>A move path can't cross enemy units (friendly units are fine), can't end off the table, and must
                        end
                        somewhere the model can physically stand.
                    </li>
                    <li>Ground units can't cross sheer terrain (elevation change over 1"), Large/Massive Terrain,
                        Obstructions, or Blocking Features, unless a trait says otherwise.
                    </li>
                    <li><b>Reposition</b> ability: moves exactly like a normal Move, but ends that unit's activation.
                    </li>
                    <li><b id="close-quarters">Close Quarters:</b> opposing ground units that end a Move in base contact
                        are
                        in Close Quarters (can be with multiple units at once). Units in Close Quarters can't attack
                        each
                        other unless stated otherwise. If an active unit tries to leave Close Quarters, each inactive
                        enemy
                        unit there may make one immediate attack against it — this doesn't use up that weapon's normal
                        use
                        for the unit's own activation.
                    </li>
                    <li><b>Variant movement</b> (e.g. Aircraft: Fixed Wing): moves in a straight line that starts in the
                        unit's front arc and ends in its rear arc, with a minimum travel distance.
                    </li>
                </ul>
                <a class="back-to-top" href="#rules-menu">↑ Contents</a>
            </div>

            <div class="rule-section" id="rule-terrain">
                <h4>Terrain</h4>
                <ul>
                    <li>Units can't move through <a class="rule-term" href="#rule-los-cover">Obstructions or Blocking
                        Features</a> unless noted on their card.
                    </li>
                    <li>Aircraft ignore all terrain under 12" tall when moving (12"+ counts as Massive Terrain).</li>
                    <li>Grav Drive units ignore elevation changes and terrain under 6" when moving (6"+ counts as Large
                        Terrain).
                    </li>
                </ul>
                <a class="back-to-top" href="#rules-menu">↑ Contents</a>
            </div>

            <div class="rule-section" id="rule-attacking">
                <h4>Attacking</h4>
                <ul>
                    <li>A weapon may attack once, or up to its ATKS value. Multiple ATKS with one weapon must be used
                        consecutively — no other actions in between — or the remaining attacks are lost; they don't need
                        to
                        target the same unit.
                    </li>
                    <li>To attack: declare the weapon and a target within range and firing arc. Range is measured
                        between
                        the closest points of the attacker's and target's bases.
                    </li>
                    <li>Draw an imaginary line between the two units' base centers (the line-of-sight) to determine
                        which
                        firing arc the attacker is using, and which arc is being targeted on the defender.
                    </li>
                    <li>Targeting the defender's rear arc is an <b id="ambush">Ambush</b>: if the attack hits, reroll
                        all
                        blank results once on the Damage roll.
                    </li>
                    <li>A weapon with no arc symbol shown has no firing-arc restriction and can target 360°.</li>
                </ul>
                <a class="back-to-top" href="#rules-menu">↑ Contents</a>
            </div>

            <div class="rule-section" id="rule-los-cover">
                <h4>Line of Sight &amp; Cover</h4>
                <ul>
                    <li><b id="blocking-feature">Blocking Feature:</b> solid, at least 1" higher than the taller unit's
                        base, and at least 1" wide facing the attacker (structures, rocks, hills, Major Points of
                        Interest).
                        Fully blocks line-of-sight — the attack can't proceed — unless the attacker is Aircraft
                        (Aircraft
                        ignore Blocking Features unless they'd grant Cover).
                    </li>
                    <li><b id="obstruction">Obstruction:</b> anything that doesn't meet all three Blocking Feature
                        conditions (solid, tall enough, wide enough) — fences, foliage, low walls, rubble, smoke, Minor
                        Points of Interest. Adds +1 Dodge to the defender per Obstruction interrupting line-of-sight,
                        rather
                        than blocking the attack outright. Aircraft ignore Obstructions unless they'd grant Cover.
                    </li>
                    <li><b id="cover">Cover:</b> if the attacker is within 1" of an Obstruction that interrupts
                        line-of-sight to a defender who is more than 1" from that same Obstruction, the attacker is
                        under
                        Cover: +1 Dodge when defending, +1 Target when attacking, and not itself Obstructed when
                        attacking.
                    </li>
                    <li><b id="high-ground">High Ground:</b> if either unit's base is 1" or more higher than the
                        other's,
                        that unit has High Ground — +1 Dodge, and +1 DMG on attacks that hit, for the higher unit.
                        Aircraft
                        ignore High Ground.
                    </li>
                    <li><b>Large Terrain</b> (over 6" tall): blocks line-of-sight between ground units, and between
                        aircraft
                        and ground units. Does not block sight between two aircraft.
                    </li>
                    <li><b>Massive Terrain</b> (over 12" tall): blocks all line-of-sight and movement for every unit.
                    </li>
                </ul>
                <a class="back-to-top" href="#rules-menu">↑ Contents</a>
            </div>

            <div class="rule-section" id="rule-damage">
                <h4>Rolling Attacks &amp; Damage</h4>
                <p><b>Attack roll:</b> roll dice equal to the weapon's ACC, plus any modifiers or static bonuses. Total
                    the
                    Target results and compare to the defender's Dodge. Meets or exceeds Dodge = hit; otherwise the
                    attack
                    ends.</p>
                <p><b>Damage roll</b> (only if the attack hit): roll dice equal to the weapon's DMG, plus modifiers or
                    static bonuses. Total the Impact and Pierce results and compare to the defender's DEF. Traits like
                    Armored or Squad may restrict which symbols count toward that total; weapon traits like [AP] can
                    negate
                    those restrictions. Meets or exceeds DEF = 1 Hit Token (or the unit is destroyed outright if it has
                    1
                    HP).</p>
                <p>Hit Tokens equal to or exceeding a unit's HP destroy it. When a unit is destroyed, its opponent may
                    place
                    1 Salvage token adjacent to it for every 2 HP it had.</p>
                <p><b>Dice symbols:</b> Pierce counts as a Damage success (same as Impact, unless a card says
                    otherwise).
                    Impact counts as a Damage success. Target counts as an Attack-roll success (also used in Surveys).
                    Gate
                    isn't inherently a success on its own, but can be converted to other results by certain Commands or
                    Traits.</p>
                <a class="back-to-top" href="#rules-menu">↑ Contents</a>
            </div>

            <div class="rule-section" id="rule-commands">
                <h4>Commands</h4>
                <ul>
                    <li>Each force has 2 Command cards, usable by spending command points from the same 20-point pool
                        used
                        for the initiative bid.
                    </li>
                    <li>A command can only be used once per thing it affects (one roll, one weapon, one initiative
                        value,
                        etc.) unless it states otherwise.
                    </li>
                    <li>Command points reset to 20 every turn during the reset phase.</li>
                </ul>
                <a class="back-to-top" href="#rules-menu">↑ Contents</a>
            </div>

            <div class="rule-section" id="rule-salvage">
                <h4>Finding Salvage</h4>
                <ul>
                    <li>Get a ground unit within 1" of a Point of Interest and Survey: roll 4 dice — 5 or more total
                        places
                        a Salvage token adjacent to the Point. Minor Points are removed once successfully surveyed; the
                        Major Point can be surveyed once per turn per unit and is never removed after a successful
                        survey.
                    </li>
                    <li>Failed Survey (without the Surveyor trait): Minor Points are removed from the board entirely;
                        the
                        Major Point instead gains 1 Hit Token (2 Hit Tokens removes it).
                    </li>
                    <li>Aircraft can't Survey unless their card says otherwise.</li>
                    <li>The Surveyor trait makes successful Surveys easier, prevents destruction on a failed roll, and
                        may
                        yield extra Salvage.
                    </li>
                    <li>Salvage can be loaded onto an active Transport within 1" (it counts as a Squad for transport
                        capacity). If a Transport carrying Salvage is destroyed, the Salvage is placed adjacent to it
                        before
                        the Transport is removed.
                    </li>
                </ul>
                <a class="back-to-top" href="#rules-menu">↑ Contents</a>
            </div>

            <div class="rule-section" id="rule-winning">
                <h4>Winning</h4>
                <ul>
                    <li>Declare a Beacon active before your first unit activates each turn; at the same point next turn,
                        that Beacon and any Salvage within 2" of it are extracted.
                    </li>
                    <li>3 or more extracted Salvage tokens: you may declare victory at the end of that turn.</li>
                    <li>Alternatively, if all opposing units are destroyed, the surviving player may declare victory.
                    </li>
                </ul>
                <a class="back-to-top" href="#rules-menu">↑ Contents</a>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.rules-toc {
    margin: 0;
    padding-left: 20px;
    columns: 2;
    column-gap: 28px;

    a {
        color: var(--sand);
        text-decoration: none;

        &:hover {
            text-decoration: underline;
            color: var(--orange);
        }
    }
}

.card-rules {
    margin-bottom: 30px;
    padding-bottom: 6px;
    color: var(--sand);

    .note {
        color: var(--mute);
    }

    h4 {
        color: var(--ink);
        font-weight: bold;
        font-size: 90%;
        letter-spacing: 2px;
        text-transform: uppercase;
        border-bottom: 1px solid var(--line);
        padding-bottom: 7px;
        margin: 34px 0 16px;
    }

    h3 {
        color: var(--teal2);
        font-size: 90%;
    }
}

.back-to-top {
    color: var(--mute);
    font-size: 80%;
    text-decoration: none;

    &:hover {
        color: var(--teal);
    }
}
</style>
