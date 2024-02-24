import React from "react";
import {StorageOpt} from "../type";
import {useRequest} from "ahooks";
import {Skeleton} from "antd";
import {MarkNoteCard} from "../MarkCard";

type Option = {} & StorageOpt;

export const useMarkNote = (option: Option) => {
  let $queryAll = useRequest(args => option.queryAll(option?.storageKey), {});
  return [<Skeleton loading={$queryAll.loading}>
    <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
      {($queryAll.data ?? []).map(e => <MarkNoteCard value={e} />)}
    </div>
  </Skeleton>];
}
