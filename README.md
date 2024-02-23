# @hocgin/marks

> 文本标注

## 草稿

```js

let [list, {save, remove}] = useMarksStorage();

let {mark, unmark, unmarkAll} = useMarksSelector({
  el,
  defaultValue: list,
  onMarked: (item) => {
    save(item);
  },
  onUnMarked: (item) => {
    remove(item.uid);
  }
});

let uid = mark([{text, offset, storeRenderOther}])

unmark(uid)


```

## 依赖或参考 lib

### incubator-annotator

> Pkg: https://github.com/apache/incubator-annotator
> Demo: https://annotator.apache.org/demo/
> Demo.Source: https://github.com/apache/incubator-annotator/blob/b52460a94ea91587ea96ecb77debc827d71b2920/web/index.js

### js-mark

> Pkg: https://github.com/BigCoal/js-mark
> Demo: http://webviews.cn/js-mark/

### mark.js

> Pkg: https://github.com/julkue/mark.js
> Demo: https://www.cnblogs.com/yangyukeke/p/17730681.html

### 参考资料

- [完整代码](https://www.cnblogs.com/yangyukeke/p/17730681.html)
- https://juejin.cn/post/6854573210638221320
# react-mark
