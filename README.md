## 项目说明
由于担心哪天含有圣经真理材料的网站会被封禁。所以写了个爬虫，爬取属灵文章做本地存档。

## 使用方式
访问 https://shengjingzhenli.com/web/book/index.html 找到感兴趣的书籍，点击进入后，url中会显示书籍id，将index.js中的bookId 修改为对应的id。如果书籍分为多辑，一般id是连续的，可以设置 seriesCount 下载多本连续书籍。

然后运行
```
npm install
node index.js
```