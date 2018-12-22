import * as UI from 'interfaces/UiGraph/index';
import UiNodeFactory from 'modules/UiNodeFactory/UiNodeFactory';

export default class SpriteFactory extends UiNodeFactory {
  public createUiNode(nodeParams?: UI.SpriteNodeParams): PIXI.Container | null {
    let texture = undefined;

    if (nodeParams) {
      if (nodeParams.textureName && PIXI.utils.TextureCache[nodeParams.textureName]) {
        texture = PIXI.utils.TextureCache[nodeParams.textureName];
      }
    }

    return new PIXI.Sprite(texture);
  }
}
