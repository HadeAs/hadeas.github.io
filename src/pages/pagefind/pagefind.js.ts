/*
 * @Author: Zhicheng Huang
 * @Date: 2024-01-18 14:13:00
 * @LastEditors: Zhicheng Huang
 * @LastEditTime: 2024-01-18 14:13:06
 * @Description:
 */
import type { APIContext } from "astro";

export async function GET({}: APIContext) {
  return {
    body: "export const search = () => {return {results: []}}",
  };
}
