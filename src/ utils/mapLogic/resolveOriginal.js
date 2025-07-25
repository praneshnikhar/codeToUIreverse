import { SourceMapConsumer } from "source-map";

/**
 * Given the raw source map JSON, and generated line and column,
 * return the original position in source code.
 * @param {Object} rawSourceMap JSON object parsed from *.map file
 * @param {{line: number, column: number}} position - generated location
 * @returns {{ source: string, line: number, column: number, name: string|null }}
 */
export function resolveOriginalPosition(rawSourceMap, position) {
  let result = null;
  SourceMapConsumer.with(rawSourceMap, null, (consumer) => {
    result = consumer.originalPositionFor({
      line: position.line,
      column: position.column,
    });
  });
  return result;
}
