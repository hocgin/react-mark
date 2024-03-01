import React, {useRef} from "react";
import {IScroll, MaskEntity, StorageOpt} from "../type";
import {useInfiniteScroll, useRequest} from "ahooks";
import {MarkNoteCard} from "../MarkCard";
import classNames from "classnames";

type Option = {
  className?: string;
  storageKey?: string;
  manual?: boolean;
  defaultParams?: any;
  scroll?: (key: string, params?: any) => Promise<IScroll<MaskEntity>>
  saveOrUpdate?: (key: string, entity: MaskEntity) => Promise<void>
  remove?: (key: string, id: string) => Promise<void>
  renderFooter?: (entity: MaskEntity) => React.ReactElement
};

function asScroll<T>(result: IScroll<T>) {
  return {
    list: result?.records,
    hasMore: result?.hasMore,
    nextId: result?.nextId,
  };
}

export const useMarkNote = (option: Option) => {
  let storageKey = option?.storageKey;
  let ref = useRef();
  let {data, reloadAsync} = useInfiniteScroll(params => option.scroll(storageKey, params).then(asScroll), {
    manual: option?.manual,
    isNoMore: (d) => d?.nextId === undefined,
    target: ref,
    threshold: 200,
  });
  let $saveOrUpdate = useRequest(entity => option.saveOrUpdate(storageKey, entity), {
    manual: true,
  });
  let $remove = useRequest(id => option.remove(storageKey, id), {
    manual: true,
  });
  return [
    <div ref={ref} style={{display: 'flex', flexDirection: 'column', gap: 4}} className={classNames(option?.className)}>
      {(data?.list ?? []).map(e => <MarkNoteCard value={e} footer={option?.renderFooter?.(e)} onRemove={$remove.run}
                                                 onChange={$saveOrUpdate.runAsync} />)}
    </div>, {
      reloadAsync: () => reloadAsync(),
    }] as const;
}
