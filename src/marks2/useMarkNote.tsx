import React from "react";
import {StorageOpt} from "../type";
import {useRequest} from "ahooks";
import {Skeleton} from "antd";

type Option = {} & StorageOpt;

export const useMarkNote = (option: Option) => {
  let $queryAll = useRequest(args => option.queryAll(option?.storageKey), {});
  return [<Skeleton loading={$queryAll.loading}>
    {($queryAll.data ?? []).map(e => <div>{e.text}</div>)}
  </Skeleton>];
}
