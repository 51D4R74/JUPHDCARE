/**
 * Points ledger — DEPRECATED (S18).
 *
 * All point computation is now done in parent components from server data:
 *   - Check-in points: `scores.hasCheckedIn ? POINT_VALUES.checkin : 0`
 *   - Mission points: `missions.reduce((sum, m) => sum + m.pointsEarned, 0)`
 *   - Constancy: `ConstancyDots` derives from server `checkedInDates`
 *
 * This file is retained for git history. No runtime code remains.
 * DEBT: delete this file after one release cycle [cleanup]
 */
