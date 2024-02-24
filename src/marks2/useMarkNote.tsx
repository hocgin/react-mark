import React from "react";
import {StorageOpt} from "../type";
import {useRequest} from "ahooks";
import {Skeleton} from "antd";
import {Editor} from '@hocgin/editor'
import {MarkCard} from "@hocgin/marks";

type Option = {} & StorageOpt;

export const useMarkNote = (option: Option) => {
  let $queryAll = useRequest(args => option.queryAll(option?.storageKey), {});
  return [<Skeleton loading={$queryAll.loading}>
    {($queryAll.data ?? []).map(e => <div>
      <div>{e.text}</div>
      <div>
        <MarkCard value={{}} />
      </div>
    </div>)}
  </Skeleton>];
}
