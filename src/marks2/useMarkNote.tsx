import React from "react";
import {StorageOpt} from "../type";
import {useRequest} from "ahooks";
import {Skeleton} from "antd";
import {MarkNoteCard} from "../MarkCard";

type Option = {} & StorageOpt;

export const useMarkNote = (option: Option) => {
  let $queryAll = useRequest(args => option.queryAll(option?.storageKey), {});
  let $saveOrUpdate = useRequest(entity => option.saveOrUpdate(option?.storageKey, entity), {
    manual: true,
  });
  let $remove = useRequest(id => option.remove(option?.storageKey, id), {
    manual: true
  });
  return [<Skeleton loading={$queryAll.loading}>
    <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
      {($queryAll.data ?? []).map(e => <MarkNoteCard value={e} onRemove={$remove.run} onChange={$saveOrUpdate.run} />)}
    </div>
  </Skeleton>];
}
