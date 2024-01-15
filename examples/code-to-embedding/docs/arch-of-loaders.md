# Explaining Document Loaders of LangchainJS

## meta

- location: langchain/src/document_loaders

## Why

Loader 主要用于加载内容，可能是本地文件(MD/PDF/HTML/CODE/TXT/DOC/PPT，甚至目录，等等)，也可能是线上内容(某个网站/GITHUB/GITBOOK/AZURE STORAGE 等)。
Loader 做的事情，一是理解这些不同数据源不同数据格式的内容，将其转换为后续流程能够处理的文本内容形式；二是返回标准化的 Document 对象，这个对象很简单，只有：Content、Meta 两个属性，Meta 随 Loader 不同，具体属性有所变化，主要用于记录文件的元信息，典型 case 是 CSV-loader，针对一个 CSV 会按照行拆分成多个 Document 对象返回，每个 doc 对象都会包含一行内容，以及这是第几行，等等。

## What can we do

langchainjs 提供的 loader 其实很粗糙，几乎都或多或少有一些问题，包括：

- `DirLoader`：居然不支持对目录做筛选过滤，且子 loader 设置居然是根据扩展名来的，应该用 glob 会更灵活；
- `GithubLoader`：太慢了
