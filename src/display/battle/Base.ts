import * as PIXI from 'pixi.js';
import Resource from 'Resource';
import SoundManager from 'managers/SoundManager';
import Attackable from 'display/battle/Attackable';
import CollapseExplodeEffect from 'display/battle/single_shot/CollapseExplodeEffect';

const baseId1SpawnFrameCount = 16;

/**
 * 拠点の振舞い、及び見た目に関する処理を行う
 * Attackable を継承する
 */
export default class Base extends Attackable {
  /**
   * 爆発エフェクト用コンテナ
   */
  public explodeContainer: PIXI.Container = new PIXI.Container();

  /**
   * 拠点 ID
   */
  protected baseId!: number;

  /**
   * 初期座標、アニメーションなどで更新されるため覚えておく
   */
  protected originalPositon: PIXI.Point = new PIXI.Point();

  /**
   * このクラスで利用するリソースリスト
   */
  public static get resourceList(): string[] {
    return [Resource.Audio.Se.UnitSpawn];
  }

  /**
   * コンストラクタ
   */
  constructor(baseId: number) {
    super();

    this.baseId = baseId;

    this.animationType = Resource.AnimationTypes.Base.IDLE;

    this.sprite = new PIXI.Sprite(Resource.TextureFrame.Base(baseId));

    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 1.0;

    // 本来はアニメーション系ミドルウェアで設定する部分
    switch (baseId) {
      case 1: this.sprite.position.y = 300; break;
      case 2:
      default: this.sprite.position.y = 200; break;
    }

    this.originalPositon.set(this.sprite.position.x, this.sprite.position.y);
  }

  /**
   * UpdateObject インターフェース実装
   * requestAnimationFrame 毎のアップデート処理
   */
  public update(_dt: number): void {
    this.updateAnimation();
  }

  /**
   * アニメーションを初期化する
   */
  public resetAnimation(): void {
    this.animationType = Resource.AnimationTypes.Base.IDLE;
    this.elapsedFrameCount = 0;
  }

  /**
   * 破壊状態にする
   */
  public collapse(): void {
    this.animationType = Resource.AnimationTypes.Base.COLLAPSE;
    this.elapsedFrameCount = 0;
  }
  /**
   * ユニット生成状態にする
   */
  public spawn(playSe: boolean): void {
    if (playSe) {
      this.playSpawnSe();
    }

    this.animationType = Resource.AnimationTypes.Base.SPAWN;
    this.elapsedFrameCount = 0;
  }

  /**
   * アニメーションを更新する
   */
  public updateAnimation(): void {
    switch (this.animationType) {
      case Resource.AnimationTypes.Base.COLLAPSE: {
        this.explodeContainer.position.set(
          this.sprite.position.x - this.sprite.width * this.sprite.anchor.x,
          this.sprite.position.y - this.sprite.height * this.sprite.anchor.y
        );
        if ((this.elapsedFrameCount % 10) === 0) {
          this.spawnCollapseExplode();
        }
        const direction = (this.elapsedFrameCount % 2 === 0) ? 1 : -1;
        this.sprite.position.x = this.sprite.position.x + 4 * direction;
        break;
      }
      case Resource.AnimationTypes.Base.SPAWN: {
        if (this.baseId === 1) {
          this.sprite.texture = Resource.TextureFrame.Base(this.baseId, 2);

          if (this.elapsedFrameCount >= baseId1SpawnFrameCount) {
            this.resetAnimation();
          }
        } else {
          this.animationType = Resource.AnimationTypes.Base.IDLE;
        }
        break;
      }
      case Resource.AnimationTypes.Base.IDLE:
      default: {
        if (this.baseId === 1) {
          this.sprite.texture = Resource.TextureFrame.Base(this.baseId, 1);
        } else if (this.baseId === 2) {
          const r  = 20;  // range
          const t  = 400; // duration

          const wave = Math.sin((2 * Math.PI / t) * this.elapsedFrameCount);
          this.sprite.position.y = this.originalPositon.y + -r * wave;
        }

        break;
      }
    }

    for (let i = 0; i < this.explodeContainer.children.length; i++) {
      const effect = this.explodeContainer.children[i];
      (effect as CollapseExplodeEffect).update(1);
    }

    this.elapsedFrameCount++;
  }

  /**
   * 破壊時の爆発を生成する
   */
  private spawnCollapseExplode(): void {
    const scale = 1.0 + Math.random() % 0.8 - 0.4;

    const effect = new CollapseExplodeEffect();
    effect.position.x = Math.random() * this.sprite.width;
    effect.position.y = Math.random() * this.sprite.height;
    effect.scale.set(scale);

    this.explodeContainer.addChild(effect);
  }

  /**
   * ユニット生成時の効果音を再生する
   */
  private playSpawnSe(): void {
    const sound = SoundManager.getSound(Resource.Audio.Se.UnitSpawn);
    if (sound) {
      sound.play();
    }
  }
}
