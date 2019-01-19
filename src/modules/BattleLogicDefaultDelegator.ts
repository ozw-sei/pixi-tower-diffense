import BattleLogicDelegate from 'interfaces/BattleLogicDelegate';
import AttackableEntity from 'entity/AttackableEntity';
import UnitEntity from 'entity/UnitEntity';
import BaseEntity from 'entity/BaseEntity';

/**
 * BattleLogicDelegate のデフォルト実装
 * 基本的には何もしない
 */
export default class DefaultDelegator implements BattleLogicDelegate {
  public spawnBaseEntity(_baseId: number, _isPlayer: boolean): BaseEntity | null { return null; };
  public spawnUnitEntity(_unitId: number, _baseEntity: BaseEntity, _isPlayer: boolean): UnitEntity | null { return null; };
  public onAttackableEntityStateChanged(_entity: AttackableEntity, _oldState: number): void {}
  public onAttackableEntityHealthUpdated(_attacker: AttackableEntity, _target: AttackableEntity, _fromHealth: number, _toHealth: number, _maxHealth: number): void { }
  public onAvailableCostUpdated(_cost: number): void {}
  public onGameOver(_isPlayerWon: boolean): void {}
  public shouldLockAttackableEntity(_attacker: AttackableEntity, _target: AttackableEntity): boolean { return true; }
  public shouldDamage(_attacker: AttackableEntity, _target: AttackableEntity): boolean { return true; }
  public shouldUnitWalk(_unit: UnitEntity): boolean { return true }
}