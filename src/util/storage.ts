import {UserConfig} from "../type";
import {DefaultMarkColor} from "../type";

export class StorageKit {

  static query = async (key: string, id: string) => {
    key = `${key}-ME-${id}`;
    let item = localStorage.getItem(key);
    console.log('query', key, item);
    if (item) {
      return JSON.parse(item) as MaskEntity;
    }
  }

  static saveOrUpdate = async (key: string, entity: MaskEntity) => {
    let id = entity.id;
    key = `${key}-ME-${id}`;
    let value = JSON.stringify(entity);
    console.log('saveOrUpdate', {entity});
    localStorage.setItem(key, value);
  }

  static remove = async (key: string, id: string) => {
    key = `${key}-ME-${id}`;
    localStorage.removeItem(key);
  }

  static queryAll = async (key: string) => {
    key = `${key}-ME`;

    let result = [];
    for (let i = 0; i < localStorage.length; i++) {
      let ukey = localStorage.key(i);
      if (!ukey.startsWith(key)) continue;
      let item = localStorage.getItem(ukey);
      result.push(JSON.parse(item));
    }
    return result as MaskEntity[];
  }

  /// ===========

  static saveUserConfig = async (key: string, config: UserConfig) => {
    key = `${key}-UC`;
    console.log('saveUserConfig', config);
    localStorage.setItem(key, JSON.stringify(config));
  };

  static getUserConfig = async (key: string) => {
    key = `${key}-UC`;
    let text = localStorage.getItem(key);
    if (!text) {
      return DefaultUserConfig;
    }
    return JSON.parse(text);
  };
}

export interface MaskEntity {
  id?: string;
  color?: string;
  end: number;
  start: number;
  text: string;
  note?: string;
}

let DefaultUserConfig = {color: DefaultMarkColor};
