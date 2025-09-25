"use client";
// 动态导入客户端组件
const TypeSpecificSearchBox = dynamic(() => import('./search-box').then(m => m.TypeSpecificSearchBox), { ssr: false });
import dynamic from 'next/dynamic';

