# Text Splitters

> references:
>
> - [Text Splitters](https://js.langchain.com/docs/modules/data_connection/document_transformers/)

## Why?

为什么要对 document 做分割呢？这个问题涉及到 LLM 的运行逻辑，简单理解：你需要把大文档拆分成若干更小的块，这个块呢不能超过 LLM 上下文长度

## What do splitters do

从源码来看，不同的 splitter 有不同的分割逻辑：

- `RecursiveCharacterTextSplitter`：按照预定义 or 自定义分割符(例如 `\n`)，切分文本块，之后按照 chunkSize 的值重新拼装成适当大小的 chunk

## Appendix

### LLM 上下文长度

LLM（Large Language Model，大型语言模型）如 ChatGPT 的上下文长度指的是在单次交互中，模型能够考虑的文本量。这包括了用户的输入、模型的回复以及之前的对话历史。上下文长度是有限的，这意味着当达到一定的字符或词数限制后，最早的部分会被遗忘或丢弃，以便为新的输入和输出腾出空间。
