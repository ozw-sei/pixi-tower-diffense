import StageMaster from 'interfaces/master/StageMaster';
import UnitMaster from 'interfaces/master/UnitMaster';
import CastleMaster from 'interfaces/master/CastleMaster';
import BattleLogicDelegate from 'interfaces/BattleLogicDelegate';
import BattleLogicConfig from 'modules/BattleLogicConfig';
/**
 * ゲーム内バトルパートのマネージャ
 * ゲームロジックを中心に扱う
 */
export default class BattleLogic {
    /**
     * バトル設定
     */
    private config;
    /**
     * BattleLogicDelegate 実装オブジェクト
     */
    private delegator?;
    /**
     * 現在の利用可能なコスト
     */
    private availableCost;
    /**
     * 次に割り当てるエンティティID
     */
    private nextEntityId;
    /**
     * 生成済みの Unit インスタンスを保持する配列
     */
    private attackableEntities;
    /**
     * 生成済みの Castle インスタンスを保持する配列
     */
    private castleEntities?;
    /**
     * フィールドマスタのキャッシュ
     */
    private stageMasterCache;
    /**
     * UnitMaster をキャッシュするための Map
     */
    private unitMasterCache;
    /**
     * CastleMaster をキャッシュするための Map
     */
    private castleMasterCache;
    /**
     * StageMaster.waves をキャッシュするための Map
     */
    private aiWaveCache;
    /**
     * 外部から生成をリクエストされたユニット情報を保持する配列
     */
    private spawnRequestedUnitUnitIds;
    /**
     * 経過フレーム数
     */
    private passedFrameCount;
    /**
     * 勝敗が決まっているかどうか
     */
    private isGameOver;
    /**
     * プレイヤー情報
     */
    private player?;
    /**
     * デリゲータとマスタ情報で初期化
     */
    init(params: {
        delegator: BattleLogicDelegate;
        stageMaster: StageMaster;
        unitMasters: UnitMaster[];
        player: {
            unitIds: number[];
            castle: CastleMaster;
        };
        ai: {
            castle: CastleMaster;
        };
        config?: BattleLogicConfig;
    }): void;
    /**
     * Unit 生成をリクエストする
     */
    requestSpawn(unitId: number, isPlayer: boolean): void;
    /**
     * Unit 生成をリクエストする
     * プレイヤーユニット生成リクエストのシュガー
     */
    requestSpawnPlayer(unitId: number): void;
    /**
     * Unit 生成をリクエストする
     * AIユニット生成リクエストのシュガー
     */
    requestSpawnAI(unitId: number): void;
    /**
     * ゲーム更新処理
     * 外部から任意のタイミングでコールする
     */
    update(): void;
    /**
     * メインループ後処理
     */
    private updatePostProcess;
    /**
     * Unit のパラメータを更新する
     * ステートは全てのパラメータが変化した後に更新する
     */
    private updateEntityParameter;
    /**
     * エンティティのステートを更新する
     * ステート優先順位は右記の通り DEAD > KNOCK_BACK > ENGAGED > IDLE
     * ユニット毎に処理を行うとステートを条件にした処理結果が
     * タイミングによって異なってしまうのでステート毎に処理を行う
     */
    private updateEntityState;
    /**
     * ダメージ判定を行い、必要に応じて以下を更新する。
     * - currentHealth
     * - currentFrameDamage
     */
    private updateDamage;
    /**
     * 移動可能か判定し、必要なら以下を更新する。
     * - distance
     * - currentKnockBackFrameCount
     */
    private updateDistance;
    /**
     * ノックバック時のステート更新処理
     */
    private updateAttackableKnockBackState;
    /**
     * 接敵時のステート更新処理
     */
    private updateAttackableEngagedState;
    /**
     * 何もしていない状態でのステート更新処理
     */
    private updateAttackableIdleState;
    /**
     * バトル状況からゲーム終了かどうかを判断する
     */
    private updateGameOver;
    /**
     * プレイヤーが勝利しているかどうかを返す
     */
    private isPlayerWon;
    /**
     * AI が勝利しているかどうかを返す
     */
    private isAiWon;
    /**
     * 現在のフレームに応じて AI ユニットを生成させる
     */
    private updateAISpawn;
    /**
     * 受け付けた Unit 生成リクエストを処理する
     * プレイヤーユニットの場合はコストを消費し、Unit 生成を試みる
     */
    private updateSpawnRequest;
    /**
     * 利用可能なコストを更新し、専用のコールバックをコールする
     */
    private updateAvailableCost;
    /**
     * 1 対 多での接敵を許容する場合は true を返す
     * 例外的に 1 対 多 を許容する場合があり、例えば拠点に対しての接敵は true とする
     */
    private chivalrousFilter;
    private spawnCastle;
}
