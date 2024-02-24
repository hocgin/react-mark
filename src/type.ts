export interface UserConfig {
  color?: string;
}

export interface MaskEntity {
  id?: string;
  color?: string;
  end: number;
  start: number;
  text: string;
  note?: string;
}


export let ColorList = [
  '255, 255, 0',
  '55, 128, 134',
  '209, 47, 138',
  '184, 67, 182',
  '120, 62, 245',
  '28, 79, 136',
  '189, 89, 40',
  '146, 112, 40',
  '113, 109, 106',
  '59, 112, 228',
];
export let DefaultMarkColor = `rgba(${ColorList?.[0]}, 0.3)`;
export let DefaultUserConfig = {color: DefaultMarkColor};

export interface StorageOpt {
  storageKey?: string;
  queryAll?: (key: string) => Promise<MaskEntity[]>
  remove?: (key: string, id: string) => Promise<void>
  query?: (key: string, id: string) => Promise<MaskEntity>
  saveOrUpdate?: (key: string, entity: MaskEntity) => Promise<void>
  //
  getUserConfig?: (key: string) => UserConfig
  saveUserConfig?: (key: string, config: UserConfig) => void
}
