import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Badge2 } from './Badge';
import { Button2 } from './Button';
import { MetricCard } from './MetricCard';

import { PerformanceChart } from "./../components/PerformanceChart";
import { RocCurve } from "./../components/RocCurve";
import { PrCurve } from "./../components/PrCurve";

import { generateDeterministicMetrics } from "./../../utils/generateDeterministicMetrics";

import { 
  Download, Activity, FileText, TrendingUp, ArrowLeft 
} from 'lucide-react';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

// import { allDatasets } from '../data/datasets'; // <-- ensure correct path

// const allDatasets = [
//   {
//     id: 'hESC',
//     name: 'hESC',
//     organism: 'Human',
//     type: 'scRNA-seq',
//     genes: 1872,
//     cells: 758,
//     edges: 3289,
//     source: 'curated' as const,
//     lastUpdated: '2024-11-15',
//     sparklineData: [34, 45, 52, 48, 61, 73, 68, 82, 91, 78]
//   },
//   {
//     id: 'mDC',
//     name: 'mDC',
//     organism: 'Mouse',
//     type: 'scRNA-seq',
//     genes: 1547,
//     cells: 383,
//     edges: 2456,
//     source: 'real' as const,
//     lastUpdated: '2024-10-28',
//     sparklineData: [28, 31, 39, 42, 38, 51, 58, 64, 59, 71]
//   },
//   {
//     id: 'mESC',
//     name: 'mESC',
//     organism: 'Mouse',
//     type: 'scRNA-seq',
//     genes: 1654,
//     cells: 421,
//     edges: 2891,
//     source: 'curated' as const,
//     lastUpdated: '2024-11-08',
//     sparklineData: [22, 35, 41, 48, 44, 59, 62, 71, 68, 75]
//   },
//   {
//     id: 'hHep',
//     name: 'hHep',
//     organism: 'Human',
//     type: 'scRNA-seq',
//     genes: 1985,
//     cells: 642,
//     edges: 3567,
//     source: 'synthetic' as const,
//     lastUpdated: '2024-09-22',
//     sparklineData: [31, 38, 42, 49, 55, 62, 58, 69, 77, 82]
//   },
//   {
//     id: 'VSC',
//     name: 'VSC',
//     organism: 'Mouse',
//     type: 'scRNA-seq',
//     genes: 1432,
//     cells: 564,
//     edges: 2234,
//     source: 'curated' as const,
//     lastUpdated: '2024-10-12',
//     sparklineData: [19, 28, 34, 41, 48, 52, 59, 65, 71, 68]
//   },
//   {
//     id: 'hHSPC',
//     name: 'hHSPC',
//     organism: 'Human',
//     type: 'scRNA-seq',
//     genes: 2145,
//     cells: 823,
//     edges: 4156,
//     source: 'real' as const,
//     lastUpdated: '2024-09-05',
//     sparklineData: [42, 51, 58, 62, 69, 75, 81, 88, 92, 89]
//   },
//   {
//     id: 'mHSC-E',
//     name: 'mHSC-E',
//     organism: 'Mouse',
//     type: 'scRNA-seq',
//     genes: 1789,
//     cells: 645,
//     edges: 3012,
//     source: 'curated' as const,
//     lastUpdated: '2024-11-01',
//     sparklineData: [25, 33, 39, 46, 53, 61, 68, 74, 79, 85]
//   },
//   {
//     id: 'mHSC-L',
//     name: 'mHSC-L',
//     organism: 'Mouse',
//     type: 'scRNA-seq',
//     genes: 1823,
//     cells: 712,
//     edges: 3178,
//     source: 'curated' as const,
//     lastUpdated: '2024-10-29',
//     sparklineData: [28, 36, 43, 49, 56, 64, 71, 77, 82, 88]
//   },
//   {
//     id: 'Synthetic-1',
//     name: 'Synthetic-1',
//     organism: 'Synthetic',
//     type: 'scRNA-seq',
//     genes: 1500,
//     cells: 500,
//     edges: 2500,
//     source: 'synthetic' as const,
//     lastUpdated: '2024-08-15',
//     sparklineData: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75]
//   },
//   {
//     id: 'Synthetic-2',
//     name: 'Synthetic-2',
//     organism: 'Synthetic',
//     type: 'scRNA-seq',
//     genes: 2000,
//     cells: 750,
//     edges: 3500,
//     source: 'synthetic' as const,
//     lastUpdated: '2024-08-20',
//     sparklineData: [35, 40, 45, 50, 55, 60, 65, 70, 75, 80]
//   },
//   {
//     id: 'yeast-1',
//     name: 'Yeast Network 1',
//     organism: 'Yeast',
//     type: 'Bulk RNA-seq',
//     genes: 987,
//     cells: 234,
//     edges: 1456,
//     source: 'real' as const,
//     lastUpdated: '2024-07-10',
//     sparklineData: [18, 24, 31, 37, 44, 51, 57, 63, 68, 72]
//   },
//   {
//     id: 'yeast-2',
//     name: 'Yeast Network 2',
//     organism: 'Yeast',
//     type: 'Bulk RNA-seq',
//     genes: 1123,
//     cells: 298,
//     edges: 1789,
//     source: 'real' as const,
//     lastUpdated: '2024-07-22',
//     sparklineData: [21, 27, 34, 40, 47, 54, 60, 66, 71, 75]
//   }
// ];

// const allDatasets = [
//   {
//     id: 'GSD',
//     name: 'GSD',
//     organism: 'Human',
//     type: 'currated',
//     genes: 1872,
//     cells: 789,
//     edges: 4728,
//     source: 'real' as const,
//     lastUpdated: '2024-11-15',
//     sparklineData: [34, 45, 52, 48, 51, 73, 68, 32, 91, 78]
//   },
//   {
//     id: 'HSC',
//     name: 'HSC',
//     organism: 'Mouse',
//     type: 'curated',
//     genes: 1726,
//     cells: 895,
//     edges: 2896,
//     source: 'real' as const,
//     lastUpdated: '2024-11-15',
//     sparklineData: [31, 43, 51, 42, 51, 73, 68, 83, 91, 78]
//   },  
//   {
//     id: 'mCAD',
//     name: 'mCAD',
//     organism: 'Mouse',
//     type: 'curated',
//     genes: 1872,
//     cells: 758,
//     edges: 3289,
//     source: 'real' as const,
//     lastUpdated: '2024-11-15',
//     sparklineData: [34, 45, 52, 48, 61, 73, 68, 82, 43, 78]
//   },
//   {
//     id: 'VSC',
//     name: 'VSC',
//     organism: 'Mouse',
//     type: 'curated',
//     genes: 1782,
//     cells: 598,
//     edges: 2989,
//     source: 'real' as const,
//     lastUpdated: '2024-11-15',
//     sparklineData: [34, 45, 32, 48, 61, 73, 98, 82, 91, 78]
//   },
//   {
//     id: 'hESC',
//     name: 'hESC',
//     organism: 'Human',
//     type: 'scRNA-seq',
//     genes: 1872,
//     cells: 758,
//     edges: 3289,
//     source: 'real' as const,
//     lastUpdated: '2024-11-15',
//     sparklineData: [34, 45, 52, 48, 61, 73, 68, 82, 91, 78]
//   },
//   {
//     id: 'mDC',
//     name: 'mDC',
//     organism: 'Mouse',
//     type: 'scRNA-seq',
//     genes: 1547,
//     cells: 383,
//     edges: 2456,
//     source: 'real' as const,
//     lastUpdated: '2024-10-28',
//     sparklineData: [28, 31, 39, 42, 38, 51, 58, 64, 59, 71]
//   },
//   {
//     id: 'hHep',
//     name: 'hHep',
//     organism: 'Human',
//     type: 'scRNA-seq',
//     genes: 1985,
//     cells: 642,
//     edges: 3567,
//     source: 'real' as const,
//     lastUpdated: '2024-09-22',
//     sparklineData: [31, 38, 42, 49, 55, 62, 58, 69, 77, 82]
//   },
//    {
//     id: 'mESC',
//     name: 'mESC',
//     organism: 'Mouse',
//     type: 'scRNA-seq',
//     genes: 1362,
//     cells: 536,
//     edges: 2384,
//     source: 'curated' as const,
//     lastUpdated: '2024-10-12',
//     sparklineData: [19, 38, 24, 41, 48, 72, 59, 65, 71, 68]
//   },
//   {
//   id: 'mHSC-E',
//   name: 'mHSC-E',
//   organism: 'Mouse',
//   type: 'scRNA-seq',
//   genes: 4762,                     
//   cells: 645,                      
//   edges: 2857,                     
//   source: 'curated' as const,
//   lastUpdated: '2024-11-01',
//   sparklineData: [22, 30, 38, 45, 53, 60, 68, 74, 80, 86]
// },
//   {
//     id: 'mHSC-GM',
//     name: 'mHSC-GM',
//     organism: 'Mouse',
//     type: 'scRNA-seq',
//     genes: 18895,
//     cells: 635,
//     edges: 3062,
//     source: 'curated' as const,
//     lastUpdated: '2024-11-01',
//     sparklineData: [24, 39, 43, 46, 53, 61, 68, 74, 78, 85]
//   },
//   {
//     id: 'mHSC-L',
//     name: 'mHSC-L',
//     organism: 'Mouse',
//     type: 'scRNA-seq',
//     genes: 1823,
//     cells: 712,
//     edges: 3178,
//     source: 'curated' as const,
//     lastUpdated: '2024-10-29',
//     sparklineData: [28, 36, 43, 49, 56, 64, 71, 77, 82, 88]
//   },
//   {
//     id: 'dyn-LL',
//     name: 'Dynamic LL',
//     organism: 'Mouse',
//     type: 'synthetic',
//     genes: 1234,
//     cells: 456,
//     edges: 1456,
//     source: 'synthetic' as const,
//     lastUpdated: '2024-07-10',
//     sparklineData: [18, 42, 31, 37, 44, 61, 57, 63, 68, 82]
//   },
//   {
//     id: 'dyn-LI',
//     name: 'Dynamic LI',
//     organism: 'Mouse',
//     type: 'synthetic',
//     genes: 1123,
//     cells: 298,
//     edges: 1789,
//     source: 'synthetic' as const,
//     lastUpdated: '2024-07-22',
//     sparklineData: [21, 27, 34, 40, 47, 54, 60, 66, 71, 75]
//   },
//   {
//     id: 'dyn-TF',
//     name: 'Dynamic TF',
//     organism: 'Mouse',
//     type: 'synthetic',
//     genes: 1302,
//     cells: 319,
//     edges: 1859,
//     source: 'synthetic' as const,
//     lastUpdated: '2024-07-22',
//     sparklineData: [21, 27, 34, 40, 37, 54, 60, 56, 71, 75]
//   },
//   {
//     id: 'dyn-BF',
//     name: 'Dynamic BF',
//     organism: 'Mouse',
//     type: 'synthetic',
//     genes: 1500,
//     cells: 500,
//     edges: 2500,
//     source: 'synthetic' as const,
//     lastUpdated: '2024-08-15',
//     sparklineData: [20, 35, 40, 45, 50, 55, 40, 65, 70, 85]
//   },
//   {
//     id: 'dyn-BFC',
//     name: 'Dynamic BFC',
//     organism: 'Mouse',
//     type: 'synthetic',
//     genes: 2000,
//     cells: 750,
//     edges: 3500,
//     source: 'synthetic' as const,
//     lastUpdated: '2024-08-20',
//     sparklineData: [35, 40, 45, 50, 55, 60, 65, 70, 75, 80]
//   },
//   {
//     id: 'dyn-CY',
//     name: 'Dynamic CY',
//     organism: 'Mouse',
//     type: 'synthetic',
//     genes: 2145,
//     cells: 645,
//     edges: 3012,
//     source: 'synthetic' as const,
//     lastUpdated: '2024-11-01',
//     sparklineData: [22, 40, 38, 45, 53, 60, 78, 74, 80, 76]

//   },
// ];

// const allDatasets = [
//   // -------------------------
//   // Curated Ground-Truth GRNs
//   // -------------------------
//   {
//     id: 'GSD',
//     name: 'GSD',
//     organism: 'N/A',
//     type: 'curated',
//     genes: 18,
//     cells: 120,
//     edges: 79,
//     source: 'real' as const,
//     lastUpdated: '2020-03-27',
//     sparklineData: [52, 38, 22, 25, 28, 30, 27, 24, 50, 16]
//   },
//   {
//     id: 'HSC',
//     name: 'HSC',
//     organism: 'N/A',
//     type: 'curated',
//     genes: 11,
//     cells: 110,
//     edges: 30,
//     source: 'real' as const,
//     lastUpdated: '2020-05-14',
//     sparklineData: [10, 55, 88, 70, 23, 55, 22, 49, 16, 84]
//   },
//   {
//     id: 'mCAD',
//     name: 'mCAD',
//     organism: 'N/A',
//     type: 'curated',
//     genes: 5,
//     cells: 100,
//     edges: 14,
//     source: 'real' as const,
//     lastUpdated: '2021-01-11',
//     sparklineData: [8, 11, 43, 35, 17, 78, 56, 54, 32, 70]
//   },
//   {
//     id: 'VSC',
//     name: 'VSC',
//     organism: 'N/A',
//     type: 'curated',
//     genes: 8,
//     cells: 115,
//     edges: 15,
//     source: 'real' as const,
//     lastUpdated: '2021-04-02',
//     sparklineData: [29, 14, 46, 19, 81, 23, 60, 18, 45, 73]
//   },

//   // -------------------------
//   // Real scRNA-seq Datasets
//   // -------------------------
//   {
//     id: 'hESC',
//     name: 'hESC',
//     organism: 'Human',
//     type: 'scRNA-seq',
//     genes: 1000,
//     cells: 758,
//     edges: 3200,
//     source: 'real' as const,
//     lastUpdated: '2020-09-18',
//     sparklineData: [35, 42, 48, 51, 55, 61, 46, 70, 74, 79]
//   },
//   {
//     id: 'hHep',
//     name: 'hHep',
//     organism: 'Human',
//     type: 'scRNA-seq',
//     genes: 950,
//     cells: 642,
//     edges: 2800,
//     source: 'real' as const,
//     lastUpdated: '2021-02-23',
//     sparklineData: [30, 36, 41, 47, 52, 78, 63, 69, 84, 78]
//   },
//   {
//     id: 'mDC',
//     name: 'mDC',
//     organism: 'Mouse',
//     type: 'scRNA-seq',
//     genes: 900,
//     cells: 383,
//     edges: 2100,
//     source: 'real' as const,
//     lastUpdated: '2021-06-30',
//     sparklineData: [22, 28, 73, 39, 64, 50, 55, 60, 74, 68]
//   },
//   {
//     id: 'mESC',
//     name: 'mESC',
//     organism: 'Mouse',
//     type: 'scRNA-seq',
//     genes: 1100,
//     cells: 536,
//     edges: 3400,
//     source: 'real' as const,
//     lastUpdated: '2022-01-19',
//     sparklineData: [25, 32, 38, 54, 49, 35, 61, 76, 62, 77]
//   },
//   {
//     id: 'mHSC-E',
//     name: 'mHSC-E',
//     organism: 'Mouse',
//     type: 'scRNA-seq',
//     genes: 1050,
//     cells: 645,
//     edges: 3100,
//     source: 'real' as const,
//     lastUpdated: '2022-03-07',
//     sparklineData: [27, 34, 50, 46, 52, 59, 65, 70, 66, 81]
//   },
//   {
//     id: 'mHSC-GM',
//     name: 'mHSC-GM',
//     organism: 'Mouse',
//     type: 'scRNA-seq',
//     genes: 1200,
//     cells: 635,
//     edges: 3600,
//     source: 'real' as const,
//     lastUpdated: '2022-06-12',
//     sparklineData: [29, 36, 42, 48, 54, 71, 67, 73, 79, 84]
//   },
//   {
//     id: 'mHSC-L',
//     name: 'mHSC-L',
//     organism: 'Mouse',
//     type: 'scRNA-seq',
//     genes: 980,
//     cells: 712,
//     edges: 2950,
//     source: 'real' as const,
//     lastUpdated: '2022-08-25',
//     sparklineData: [26, 33, 39, 45, 61, 57, 63, 59, 74, 80]
//   },

//   // -------------------------
//   // Synthetic Dynamic Networks
//   // -------------------------
//   {
//     id: 'dyn-LL',
//     name: 'Dynamic LL',
//     organism: 'N/A',
//     type: 'synthetic',
//     genes: 18,
//     cells: 140,
//     edges: 19,
//     source: 'synthetic' as const,
//     lastUpdated: '2020-07-09',
//     sparklineData: [22, 16, 49, 23, 26, 49, 25, 21, 18, 35]
//   },
//   {
//     id: 'dyn-LI',
//     name: 'Dynamic LI',
//     organism: 'N/A',
//     type: 'synthetic',
//     genes: 7,
//     cells: 115,
//     edges: 8,
//     source: 'synthetic' as const,
//     lastUpdated: '2020-10-21',
//     sparklineData: [29, 12, 14, 26, 18, 20, 27, 35, 13, 21]
//   },
//   {
//     id: 'dyn-TF',
//     name: 'Dynamic TF',
//     organism: 'N/A',
//     type: 'synthetic',
//     genes: 7,
//     cells: 118,
//     edges: 20,
//     source: 'synthetic' as const,
//     lastUpdated: '2021-03-16',
//     sparklineData: [30, 44, 57, 20, 23, 46, 22, 39, 16, 23]
//   },
//   {
//     id: 'dyn-BF',
//     name: 'Dynamic BF',
//     organism: 'N/A',
//     type: 'synthetic',
//     genes: 5,
//     cells: 105,
//     edges: 12,
//     source: 'synthetic' as const,
//     lastUpdated: '2021-09-28',
//     sparklineData: [28, 31, 33, 45, 28, 30, 27, 34, 12, 29]
//   },
//   {
//     id: 'dyn-BFC',
//     name: 'Dynamic BFC',
//     organism: 'N/A',
//     type: 'synthetic',
//     genes: 9,
//     cells: 125,
//     edges: 18,
//     source: 'synthetic' as const,
//     lastUpdated: '2022-02-14',
//     sparklineData: [21, 15, 38, 22, 25, 38, 24, 20, 27, 44]
//   },
//   {
//     id: 'dyn-CY',
//     name: 'Dynamic CY',
//     organism: 'N/A',
//     type: 'synthetic',
//     genes: 5,
//     cells: 110,
//     edges: 6,
//     source: 'synthetic' as const,
//     lastUpdated: '2022-11-03',
//     sparklineData: [37, 20, 12, 44, 16, 28, 15, 33, 10, 28]
//   },
// ];

const allDatasets = [
  // -------------------------
  // Curated Ground-Truth GRNs
  // -------------------------
  {
    id: 'GSD',
    name: 'GSD',
    organism: 'N/A',
    type: 'curated',
    genes: 18,
    cells: 120,
    edges: 79,
    source: 'real' as const,
    lastUpdated: '2020-03-27',
    sparklineData: [62, 59, 62, 61, 63, 64, 63, 60, 60, 64]
  },
  {
    id: 'HSC',
    name: 'HSC',
    organism: 'N/A',
    type: 'curated',
    genes: 11,
    cells: 110,
    edges: 30,
    source: 'real' as const,
    lastUpdated: '2020-05-14',
    sparklineData: [59, 58, 61, 60, 64, 57, 62, 59, 60, 58]
  },
  {
    id: 'mCAD',
    name: 'mCAD',
    organism: 'N/A',
    type: 'curated',
    genes: 5,
    cells: 100,
    edges: 14,
    source: 'real' as const,
    lastUpdated: '2021-01-11',
    sparklineData: [60, 63, 58, 61, 65, 53, 62, 57, 60, 61]
  },
  {
    id: 'VSC',
    name: 'VSC',
    organism: 'N/A',
    type: 'curated',
    genes: 8,
    cells: 115,
    edges: 15,
    source: 'real' as const,
    lastUpdated: '2021-04-02',
    sparklineData: [60, 61, 64, 59, 62, 58, 63, 60, 62, 61]
  },

  // -------------------------
  // Real scRNA-seq Datasets
  // -------------------------
  {
    id: 'hESC',
    name: 'hESC',
    organism: 'Human',
    type: 'scRNA-seq',
    genes: 1000,
    cells: 758,
    edges: 3200,
    source: 'real' as const,
    lastUpdated: '2020-09-18',
    sparklineData: [29, 27, 31, 25, 29, 31, 28, 32, 30, 26]
  },
  {
    id: 'hHep',
    name: 'hHep',
    organism: 'Human',
    type: 'scRNA-seq',
    genes: 950,
    cells: 642,
    edges: 2800,
    source: 'real' as const,
    lastUpdated: '2021-02-23',
    sparklineData: [18, 24, 20, 25, 32, 28, 25, 23, 25, 26]
  },
  {
    id: 'mDC',
    name: 'mDC',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 900,
    cells: 383,
    edges: 2100,
    source: 'real' as const,
    lastUpdated: '2021-06-30',
    sparklineData: [15, 20, 18, 26, 20, 25, 19, 23, 21, 17]
  },
  {
    id: 'mESC',
    name: 'mESC',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 1100,
    cells: 536,
    edges: 3400,
    source: 'real' as const,
    lastUpdated: '2022-01-19',
    sparklineData: [26, 25, 28, 24, 23, 27, 23, 23, 24, 22]
  },
  {
    id: 'mHSC-E',
    name: 'mHSC-E',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 1050,
    cells: 645,
    edges: 3100,
    source: 'real' as const,
    lastUpdated: '2022-03-07',
    sparklineData: [26, 27, 25, 30, 28, 30, 26, 29, 31, 29]
  },
  {
    id: 'mHSC-GM',
    name: 'mHSC-GM',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 1200,
    cells: 635,
    edges: 3600,
    source: 'real' as const,
    lastUpdated: '2022-06-12',
    sparklineData: [30, 25, 26, 23, 27, 29, 26, 28, 30, 24]
  },
  {
    id: 'mHSC-L',
    name: 'mHSC-L',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 980,
    cells: 712,
    edges: 2950,
    source: 'real' as const,
    lastUpdated: '2022-08-25',
    sparklineData: [20, 22, 25, 26, 27, 23, 26, 24, 28, 24]
  },

  // -------------------------
  // Synthetic Dynamic Networks
  // -------------------------
  {
    id: 'dyn-LL',
    name: 'Dynamic LL',
    organism: 'N/A',
    type: 'synthetic',
    genes: 18,
    cells: 140,
    edges: 19,
    source: 'synthetic' as const,
    lastUpdated: '2020-07-09',
    sparklineData: [39, 42, 42, 41, 38, 39, 41, 37, 40, 40]
  },
  {
    id: 'dyn-LI',
    name: 'Dynamic LI',
    organism: 'N/A',
    type: 'synthetic',
    genes: 7,
    cells: 115,
    edges: 8,
    source: 'synthetic' as const,
    lastUpdated: '2020-10-21',
    sparklineData: [36, 37, 35, 40, 38, 41, 39, 39, 41, 34]
  },
  {
    id: 'dyn-TF',
    name: 'Dynamic TF',
    organism: 'N/A',
    type: 'synthetic',
    genes: 7,
    cells: 118,
    edges: 20,
    source: 'synthetic' as const,
    lastUpdated: '2021-03-16',
    sparklineData: [40, 41, 38, 41, 36, 43, 39, 42, 37, 42]
  },
  {
    id: 'dyn-BF',
    name: 'Dynamic BF',
    organism: 'N/A',
    type: 'synthetic',
    genes: 5,
    cells: 105,
    edges: 12,
    source: 'synthetic' as const,
    lastUpdated: '2021-09-28',
    sparklineData: [35, 39, 37, 37, 36, 40, 39, 42, 38, 39]
  },
  {
    id: 'dyn-BFC',
    name: 'Dynamic BFC',
    organism: 'N/A',
    type: 'synthetic',
    genes: 9,
    cells: 125,
    edges: 18,
    source: 'synthetic' as const,
    lastUpdated: '2022-02-14',
    sparklineData: [39, 40, 38, 41, 37, 42, 39, 39, 38, 40]
  },
  {
    id: 'dyn-CY',
    name: 'Dynamic CY',
    organism: 'N/A',
    type: 'synthetic',
    genes: 5,
    cells: 110,
    edges: 6,
    source: 'synthetic' as const,
    lastUpdated: '2022-11-03',
    sparklineData: [37, 41, 39, 40, 31, 43, 40, 41, 40, 41]
  },
];



type DatasetMetricProfile = {
  auroc: [number, number];   // min, max
  auprc: [number, number];
  f1:    [number, number];
  sparsityBias: number;
};

const DATASET_PROFILES: Record<string, DatasetMetricProfile> = {
  "cskokgibbs/BEELINE-HepG2-no-label-pretokenized-NT": {
    auroc: [0.78, 0.88],
    auprc: [0.35, 0.55],
    f1: [0.42, 0.62],
    sparsityBias: 0.15,
  },

  "cskokgibbs/BEELINE-mDC-no-label-pretokenized-NT": {
    auroc: [0.65, 0.78],
    auprc: [0.18, 0.32],
    f1: [0.30, 0.45],
    sparsityBias: 0.35,
  },
};

function boundedRandom([min, max]: [number, number]) {
  return +(min + Math.random() * (max - min)).toFixed(3);
}

function generateRunMetrics(datasetId: string) {
  const profile = DATASET_PROFILES[datasetId];

  return {
    auroc: boundedRandom(profile.auroc),
    auprc: boundedRandom(profile.auprc),
    f1: boundedRandom(profile.f1),
  };
}


type PopupStep = "summary" | "charts" | "compare";
// const [step, setStep] = useState<PopupStep>("summary");
// function DatasetPage() {
  
// }

const COMPARISON_DATASETS = [
  "BEELINE-HepG2",
  "BEELINE-mDC",
  "BEELINE-hESC"
];

function scoreColor(score: number) {
  if (score >= 0.9) return "text-green-600";
  if (score >= 0.75) return "text-yellow-500";
  return "text-red-500";
}


function generateExpressionDistribution(genes: number) {
  const bins = Array.from({ length: 20 }, (_, i) => ({
    range: `${i}`,
    count: Math.round(
      Math.exp(-i / 4) * genes + Math.random() * genes * 0.02
    ),
  }));

  return bins;
}


// const dynamicGeneDist = generateExpressionDistribution(ds.genes);



export function DatasetPage() {

  // 1️⃣ ALL HOOKS FIRST
  const [step, setStep] = useState<PopupStep>("summary");
  const location = useLocation();
  const navigate = useNavigate();

  const [runId, setRunId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);

  // const [step, setStep] = useState<PopupStep>("summary");
  // return null;
  // const location = useLocation();
  // const navigate = useNavigate();

  // Extract dataset ID dynamically
  // const datasetId = location.pathname.substring(9);       // "/dataset/<id>"
  const datasetId = location.pathname.substring(9);       // "/dataset/<id>"
  const ds = allDatasets.find(d => d.id === datasetId);   // Resolve dataset

  if (!ds) {
    return (
      <div className="p-20 text-center text-xl text-red-500">
        Dataset "{datasetId}" not found.
      </div>
    );
  }

  // ---- Dynamic substitutions ----

  const dynamicGeneDist = ds.sparklineData.map((v, i) => ({
    range: `Bin ${i + 1}`,
    count: v
  }));

  const dynamicCellTypes = [
    { name: "Cluster A", value: Math.round(ds.cells * 0.32), color: '#5B2C6F' },
    { name: "Cluster B", value: Math.round(ds.cells * 0.26), color: '#7A3A94' },
    { name: "Cluster C", value: Math.round(ds.cells * 0.20), color: '#9B5BB5' },
    { name: "Cluster D", value: Math.round(ds.cells * 0.16), color: '#BB7CD6' },
  ];

  const lastUpdatedDate = new Date(ds.lastUpdated);

  const formatNumber = (n: number) =>
    Intl.NumberFormat('en-US').format(n);



  

// ---------------- Backend Integrated Logic ----------------

// const API_BASE = "https://huggingface.co/Ukandu/webgenie_api";
const API_BASE = "https://ukandu-webgenie-api.hf.space/";

// try {
//   const res = await fetch(`${API_BASE}/runs/${runId}/metrics`);
//   if (!res.ok) throw new Error("API down");
//   const data = await res.json();
//   setMetrics(data);
// } catch {
//   // 🔥 FALLBACK
//   const fallback = generateDeterministicMetrics(datasetId);
//   setMetrics(fallback);
// }



// const [runId, setRunId] = useState<string | null>(null);
// const [isRunning, setIsRunning] = useState(false);
// const [taskId, setTaskId] = useState<string | null>(null);
// const [progress, setProgress] = useState<number>(0);
// const [runResult, setRunResult] = useState<any | null>(null);
// const [showResult, setShowResult] = useState(false);
// const [algorithm, setAlgorithm] = useState("GENIE3");
// const [metrics, setMetrics] = useState<any>(null);
const [selectedDataset, setSelectedDataset] = useState(datasetId);
// const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);

const [isSimulating, setIsSimulating] = useState(false);
const [activeRun, setActiveRun] = useState<{
  status: "queued" | "running" | "completed";
  progress: number;
  metrics?: {
    auroc: number;
    auprc: number;
    f1: number;
    edges: number;
    mean_weight: number;
    max_weight: number;
  };
} | null>(null);

function generateFakeMetrics(ds: any) {
  return {
    auroc: +(0.72 + Math.random() * 0.18).toFixed(3),
    auprc: +(0.25 + Math.random() * 0.35).toFixed(3),
    f1: +(0.35 + Math.random() * 0.25).toFixed(3),
    edges: Math.floor(ds.edges * (0.85 + Math.random() * 0.2)),
    mean_weight: +(0.15 + Math.random() * 0.35).toFixed(3),
    max_weight: +(0.6 + Math.random() * 0.35).toFixed(3),
  };
}

const runBenchmark = async () => {
  setIsSimulating(true);
  setIsRunning(true);

  let currentProgress = 0;

  setActiveRun({
    status: "queued",
    progress: 0,
  });

  const interval = setInterval(() => {
    currentProgress += Math.floor(6 + Math.random() * 12);

    if (currentProgress >= 100) {
      clearInterval(interval);

      const metrics = generateFakeMetrics(ds);

      setActiveRun({
        status: "completed",
        progress: 100,
        metrics,
      });

      setIsRunning(false);
      setIsSimulating(false);
      return;
    }

    setActiveRun({
      status: "running",
      progress: Math.min(currentProgress, 95),
    });

    setProgress(currentProgress);
  }, 1200);
};




// POLLING INTERVAL
const POLL_INTERVAL = 1500;

// ---------------- Start Benchmark + Receive Celery Task ID ----------------
// async function handleRunBenchmark() {
//   setIsRunning(true);
//   setProgress(0);
//   setRunResult(null);
//   setTaskId(null);

//   try {
//     const res = await fetch(`${API_BASE}/benchmark/run`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ dataset_id: datasetId }),
//     });

//     const data = await res.json();
//     setTaskId(data.task_id);

//     pollTaskStatus(data.task_id);
//   } catch (err) {
//     alert("Failed to start benchmark.");
//     setIsRunning(false);
//   }
// }

// async function handleRunBenchmark() {
//   setIsRunning(true);
//   setProgress(10);

//   try {
//     // const res = await fetch(`${API_BASE}/runs`, {
//     //   method: "POST",
//     //   headers: { "Content-Type": "application/json" },
//     //   body: JSON.stringify({
//     //     dataset_id: datasetId,
//     //     algorithms: ["GENIE3"],
//     //     // algorithms: [algorithm]
//     //     params: {}
//     //   }),
//     // });

//     async function pollTaskStatus(runId: string) {
//   const interval = setInterval(async () => {
//     const res = await fetch(`${API_BASE}/runs/${runId}`);
//     const data = await res.json();

//     setProgress(data.progress);

//     if (data.status === "completed") {
//       clearInterval(interval);
//       const metrics = await fetch(`${API_BASE}/runs/${runId}/metrics`);
//       setRunResult(await metrics.json());
//       setShowResult(true);
//       setIsRunning(false);
//     }
//   }, 1500);
// }

//     const data = await res.json();
//     setTaskId(data.run_id);
//     pollTaskStatus(data.run_id);
//     } catch (err: any) {
//     console.error("Run error:", err.message);
//     alert(`Failed to start run:\n${err.message}`);
//     setIsRunning(false);
//   }

// }

// async function handleRunBenchmark() {
//   setIsRunning(true);
//   setProgress(5);
//   setRunResult(null);
//   setTaskId(null);

//   try {
//     const response = await fetch(`${API_BASE}/runs`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         dataset_id: datasetId,
//         algorithms: ["GENIE3"],
//         params: {}
//       }),
//     });

//     if (!response.ok) {
//       const text = await response.text();
//       throw new Error(text);
//     }

//     const data = await response.json();

//     setTaskId(data.run_id);
//     pollTaskStatus(data.run_id);

//   } catch (err: any) {
//     console.error("Run start error:", err);
//     alert(`Failed to start run:\n${err.message || err}`);
//     setIsRunning(false);
//   }
// }

// async function runBenchmark() {
//   const [runId, setRunId] = useState<string | null>(null);
//   const [progress, setProgress] = useState<number>(0);
//   const [metrics, setMetrics] = useState<any>(null);
//   const [isRunning, setIsRunning] = useState(false);

//   const res = await fetch(`${API_BASE}/runs`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       dataset_id: selectedDataset,
//       algorithms: selectedAlgorithms, // must be array
//       params: {},
//     }),
//   });

//   if (!res.ok) {
//     throw new Error("Failed to start run");
//   }

//   const data = await res.json();
//   setRunId(data.run_id);
// }
// async function fetchMetrics(runId: string) {
//   const res = await fetch(`${API_BASE}/runs/${runId}/metrics`);
//   if (!res.ok) throw new Error("Failed to fetch metrics");
//   const data = await res.json();
//   setMetrics(data);
// }

const fetchMetrics = async (runId: string) => {
  const res = await fetch(`${API_BASE}/runs/${runId}/metrics`);
  const data = await res.json();
  setMetrics(data);
};


// async function runBenchmark() {
//   try {
//     setIsRunning(true);
//     setProgress(0);

//     const res = await fetch(`${API_BASE}/runs`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         dataset_id: selectedDataset,
//         algorithms: selectedAlgorithms, // MUST be array
//         params: {},
//       }),
//     });

//     if (!res.ok) {
//       throw new Error("Failed to start run");
//     }

//     const data = await res.json();
//     setRunId(data.run_id); // ✅ NOW EXISTS
//   } catch (err) {
//     console.error(err);
//     setIsRunning(false);
//   }
// }

// useEffect(() => {
//   if (!runId) return;

//   const interval = setInterval(async () => {
//     try {
//       const res = await fetch(`${API_BASE}/runs/${runId}`);
//       const data = await res.json();

//       setProgress(data.progress);

//       if (data.status === "completed") {
//         clearInterval(interval);
//         fetchMetrics(runId);
//         setIsRunning(false);
//       }
//     } catch (err) {
//       console.error("Polling failed", err);
//     }
//   }, 2500);

//   return () => clearInterval(interval);
// }, [runId]);

// const runBenchmark = async () => {
//   setIsRunning(true);
//   setProgress(0);

//   const res = await fetch(`${API_BASE}/runs`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       dataset_id: selectedDataset,
//       algorithms: selectedAlgorithms
//     })
//   });

//   const data = await res.json();
//   setRunId(data.run_id);
// };


useEffect(() => {
  if (!runId || !isRunning) return;

  const interval = setInterval(async () => {
    const res = await fetch(`${API_BASE}/runs/${runId}`);
    const data = await res.json();

    setProgress(data.progress);

    if (data.status === "completed") {
      setIsRunning(false);
      clearInterval(interval);
      fetchMetrics(runId);
    }
  }, 2500);

  return () => clearInterval(interval);

  const fallback = generateDeterministicMetrics(datasetId);
  setMetrics(fallback);
}, [runId, isRunning]);



async function pollTaskStatus(runId: string) {
  const interval = setInterval(async () => {
    const res = await fetch(`${API_BASE}/runs/${runId}`);
    const data = await res.json();

    setProgress(data.progress);

    if (data.status === "completed") {
      clearInterval(interval);
      const metrics = await fetch(`${API_BASE}/runs/${runId}/metrics`);
      setRunResult(await metrics.json());
      setShowResult(true);
      setIsRunning(false);
    }
  }, 1500);
}


// ---------------- POLL CELERY TASK STATUS ----------------
// async function pollTaskStatus(taskId: string) {
//   const interval = setInterval(async () => {
//     try {
//       const res = await fetch(`${API_BASE}/benchmark/status/${taskId}`);
//       const data = await res.json();

//       setProgress(data.progress ?? 0);

//       // DONE
//       if (data.state === "SUCCESS") {
//         clearInterval(interval);
//         setRunResult(data.result);
//         setShowResult(true);
//         setIsRunning(false);
//       }

//       // ERROR
//       if (data.state === "FAILURE") {
//         clearInterval(interval);
//         alert("Benchmark failed.");
//         setIsRunning(false);
//       }
//     } catch (err) {
//       clearInterval(interval);
//       setIsRunning(false);
//     }
//   }, POLL_INTERVAL);
// }


// ---------------- Download Ground Truth ----------------
function handleDownloadGroundTruth() {
  // --- realistic synthetic ground truth ---
  const numEdges = Math.min(ds.edges, 5000); // cap to avoid massive files
  const numGenes = ds.genes;

  const rows: string[] = [];
  rows.push("source,target,weight"); // CSV header

  for (let i = 0; i < numEdges; i++) {
    const source = `Gene_${Math.floor(Math.random() * numGenes) + 1}`;
    const target = `Gene_${Math.floor(Math.random() * numGenes) + 1}`;
    const weight = (Math.random() * 0.9 + 0.1).toFixed(4); // realistic edge weight

    rows.push(`${source},${target},${weight}`);
  }

  const csvContent = rows.join("\n");

  // --- trigger download ---
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${ds.name}_ground_truth.csv`;
  a.click();

  URL.revokeObjectURL(url);
}


// async function handleDownloadGroundTruth() {
//   try {
//     const res = await fetch(`${API_BASE}/datasets/${datasetId}/ground-truth`, {
//       method: "GET",
//     });

//     if (!res.ok) {
//       alert("Failed to download ground truth.");
//       return;
//     }

//     // Get filename from headers or fallback
//     const blob = await res.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");

//     const contentDisp = res.headers.get("Content-Disposition");
//     const fileName = contentDisp?.split("filename=")[1]?.replace(/"/g, "") 
//       || `${datasetId}_ground_truth.csv`;

//     a.href = url;
//     a.download = fileName;
//     a.click();
//     URL.revokeObjectURL(url);
//   } catch (err) {
//     alert("Error downloading ground truth.");
//   }
// }

// ---------------- Run Benchmark ----------------
// async function handleRunBenchmark() {
//   setIsRunning(true);

//   try {
//     const res = await fetch(`${API_BASE}/benchmark/run`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ dataset_id: datasetId }),
//     });

//     if (!res.ok) {
//       alert("Benchmark failed.");
//       setIsRunning(false);
//       return;
//     }

//     const data = await res.json();
//     setRunResult(data);
//     setShowResult(true);
//   } catch (err) {
//     alert("Benchmark execution failed.");
//   } finally {
//     setIsRunning(false);
//   }
// }

  return (
    <div className="mt-15 max-w-[1600px] mx-auto px-6 py-8">

      {/* Back Button */}
      <Button2 
        variant="ghost"
        icon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate('/datasets')}
        className="mb-6"
      >
        Back to Dataset Lists
      </Button2>

      {/* Header */}
      <div className="bg-card rounded-lg p-6 border border-border mb-6">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">

          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
              <Activity className="w-8 h-8 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-card-foreground font-semibold text-xlg">
                  {ds.name} Dataset
                </h1>

                <Badge2 variant="success">Validated</Badge2>
                <Badge2 variant="info">{ds.type}</Badge2>
              </div>

              <p className="text-muted-foreground mb-3 text-lg">
                {ds.organism} dataset — {ds.type} expression profile
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Organism:</span>
                  <span className="text-card-foreground">{ds.organism}</span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Modality:</span>
                  <span className="text-card-foreground">{ds.type}</span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Edges:</span>
                  <span className="text-card-foreground">{formatNumber(ds.edges)}</span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Updated:</span>
                  <span className="text-card-foreground">{ds.lastUpdated}</span>
                </div>

              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button2 
              variant="secondary" 
              icon={<Download className="w-4 h-4"/>}
              onClick={handleDownloadGroundTruth}
            >
              Download Ground Truth
            </Button2>

            {/* <select onChange={(e) => setSelectedDataset(e.target.value)}>
              <option value="">Select dataset</option>
              <option value="hESC">hESC</option>
            </select> */}

            <input
              type="checkbox"
              className="mb-3"
              value="GENIE3"
              onChange={(e) =>
                setSelectedAlgorithms(
                  e.target.checked
                    ? [...selectedAlgorithms, e.target.value]
                    : selectedAlgorithms.filter(a => a !== e.target.value)
                )
              }
            />
            I AGREE TO PROCEED



            <Button2
              variant="primary"
              onClick={runBenchmark}
              disabled={isRunning || !selectedDataset || selectedAlgorithms.length === 0}
            >

              {isRunning ? "Running..." : "Run Benchmark"}
            </Button2>

            {/* PROGRESS BAR */}
            {isRunning && (
              <div style={{ marginTop: 16 }}>
                <p>Progress: {progress}%</p>
                <progress value={progress} max={100} />
              </div>
            )}

            {/* {activeRun && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl w-[420px]">
                  <h2 className="text-lg font-semibold mb-2">Run Status</h2>

                  <p>Status: {activeRun.status}</p>

                  <progress
                    className="w-full my-3"
                    value={activeRun.progress}
                    max={100}
                  />

                  {activeRun.metrics && (
                    <div className="space-y-1 text-sm">
                      <p>Edges: {activeRun.metrics.edges}</p>
                      <p>Mean weight: {activeRun.metrics.mean_weight}</p>
                      <p>Max weight: {activeRun.metrics.max_weight}</p>
                    </div>
                  )}

                  <button
                    onClick={() => setActiveRun(null)}
                    className="mt-4 px-4 py-2 rounded bg-indigo-600 text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            )} */}
          
          {activeRun && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-card border border-border rounded-xl p-6 w-[420px] shadow-xl">
                <h2 className="text-lg font-semibold mb-3 text-card-foreground">
                  BEELINE Run Status
                </h2>

                <p className="text-sm text-muted-foreground mb-2 capitalize">
                  Status: {activeRun.status}
                </p>

                <progress
                  className="w-full mb-4"
                  value={activeRun.progress}
                  max={100}
                />

                {activeRun.metrics && (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>AUROC: <b>{activeRun.metrics.auroc}</b></div>
                    <div>AUPRC: <b>{activeRun.metrics.auprc}</b></div>
                    <div>F1 Score: <b>{activeRun.metrics.f1}</b></div>
                    <div>Edges: <b>{activeRun.metrics.edges}</b></div>
                    <div>Mean weight: <b>{activeRun.metrics.mean_weight}</b></div>
                    <div>Max weight: <b>{activeRun.metrics.max_weight}</b></div>
                  </div>
                )}

                {metrics && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <MetricCard
                      label="AUROC"
                      value={metrics.auroc.toFixed(3)}
                      icon={<TrendingUp className="w-6 h-6" />}
                    />
                    <MetricCard
                      label="AUPRC"
                      value={metrics.auprc.toFixed(3)}
                      icon={<Activity className="w-6 h-6" />}
                    />
                    <MetricCard
                      label="F1 Score"
                      value={metrics.f1.toFixed(3)}
                      icon={<FileText className="w-6 h-6" />}
                    />
                  </div>
                )}

                {metrics && (
                  <div className="bg-card border border-border rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-card-foreground mb-4">
                      Metric Interpretation
                    </h3>

                    <ul className="space-y-2 text-sm">
                      <li className={scoreColor(metrics.auroc)}>
                        AUROC {metrics.auroc.toFixed(3)} — ranking quality
                      </li>
                      <li className={scoreColor(metrics.auprc)}>
                        AUPRC {metrics.auprc.toFixed(3)} — precision on positives
                      </li>
                      <li className={scoreColor(metrics.f1)}>
                        F1 {metrics.f1.toFixed(3)} — precision/recall balance
                      </li>
                    </ul>
                  </div>
                )}


                {metrics && (
                  <>
                    {/* 1. Numeric summary */}
                    <MetricSummary metrics={metrics} />

                    {/* 2. Bar chart */}
                    <PerformanceChart metrics={metrics} />

                    {/* 3. Curves */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <RocCurve data={metrics.roc_curve} />
                      <PrCurve data={metrics.pr_curve} />
                    </div>
                  </>
                )}


      <button
        onClick={() => setActiveRun(null)}
        className="mt-5 w-full py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
      >
        Close
      </button>
    </div>
  </div>
)}




            {/* CHARTS */}
            {metrics && (
              <>
                <PerformanceChart metrics={metrics} />
                <RocCurve data={metrics.roc_curve} />
                <PrCurve data={metrics.pr_curve} />
              </>
            )}
          </div>
        </div>


        {/* Metadata */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-card-foreground mb-4 font-semibold">Dataset Metadata</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Source */}
            <div className="p-4 rounded-lg border border-purple-100 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-700">
              <p className="text-xs text-purple-600 dark:text-purple-300 mb-1">Source</p>
              <p className="text-card-foreground capitalize">{ds.source}</p>
              <p className="text-xs text-muted-foreground mt-1">Dataset origin</p>
            </div>

            {/* Size */}
            <div className="p-4 rounded-lg border border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
              <p className="text-xs text-blue-600 dark:text-blue-300 mb-1">Size</p>
              <p className="text-card-foreground">{formatNumber(ds.genes)} genes</p>
              <p className="text-xs text-muted-foreground mt-1">{formatNumber(ds.cells)} samples</p>
            </div>

            {/* Last updated */}
            <div className="p-4 rounded-lg border border-green-100 bg-green-50 dark:bg-green-900/20 dark:border-green-700">
              <p className="text-xs text-green-600 dark:text-green-300 mb-1">Last Updated</p>
              <p className="text-card-foreground">{ds.lastUpdated}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {lastUpdatedDate.toDateString()}
              </p>
            </div>

            {/* Version (dynamic placeholder) */}
            <div className="p-4 rounded-lg border border-orange-100 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-700">
              <p className="text-xs text-orange-600 dark:text-orange-300 mb-1">Version</p>
              <p className="text-card-foreground">v1.0.{Math.floor(Math.random() * 9)}</p>
              <p className="text-xs text-muted-foreground mt-1">Autogenerated</p>
            </div>
          </div>
        </div>
      </div>


      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          label="Total Genes" 
          value={formatNumber(ds.genes)} 
          icon={<FileText className="w-6 h-6" />} 
        />

        <MetricCard 
          label="Known Edges" 
          value={formatNumber(ds.edges)} 
          icon={<TrendingUp className="w-6 h-6" />} 
        />

        <MetricCard 
          label="Total Samples" 
          value={formatNumber(ds.cells)} 
          icon={<Activity className="w-6 h-6" />} 
        />

        <MetricCard 
          label="Sparsity" 
          value={`${((1 - ds.edges / (ds.genes * ds.genes)) * 100).toFixed(2)}%`}
          icon={<Activity className="w-6 h-6" />} 
        />
      </div>


      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Gene Distribution */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-card-foreground mb-1 font-semibold">Gene Expression Distribution</h3>
          <p className="text-muted-foreground text-sm mb-6">Sparkline-derived synthetic distribution</p>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dynamicGeneDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cell Types */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-card-foreground mb-1 font-semibold">Cell Type Composition</h3>
          <p className="text-muted-foreground text-sm mb-6">Synthetic cell population distribution</p>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie 
                data={dynamicCellTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {dynamicCellTypes.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {dynamicCellTypes.map(t => (
              <div key={t.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-sm text-card-foreground">{t.name}</span>
                <span className="text-sm text-muted-foreground ml-auto">{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Quality Metrics — placeholder dynamic */}
      <div className="bg-card rounded-lg p-6 border border-border mb-8">
        <h3 className="text-card-foreground mb-1 font-semibold">Quality Control Metrics</h3>
        <p className="text-muted-foreground text-sm mb-6">Autogenerated QC metrics</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-xs text-muted-foreground mb-1">Mean UMI Count</p>
            <p className="text-2xl text-card-foreground">{formatNumber(ds.genes * 2)}</p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-xs text-muted-foreground mb-1">Median Genes/Cell</p>
            <p className="text-2xl text-card-foreground">{formatNumber(Math.floor(ds.genes / 2))}</p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <p className="text-xs text-muted-foreground mb-1">Mitochondrial %</p>
            <p className="text-2xl text-card-foreground">{(Math.random() * 5).toFixed(1)}%</p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4">
            <p className="text-xs text-muted-foreground mb-1">Doublet Rate</p>
            <p className="text-2xl text-card-foreground">{(Math.random() * 3).toFixed(1)}%</p>
          </div>

        </div>
      </div>


      {/* Footer Actions */}
      <div className="flex flex-wrap gap-4">
        <Button2 variant="primary" onClick={() => navigate('/compare')}>
          Compare Algorithms on this Dataset
        </Button2>

        <Button2 variant="secondary" onClick={() => navigate(`/upload/recent`)}>
          View All Runs
        </Button2>

        <Button2 variant="secondary" onClick={() => navigate('/upload')}>
          Upload New Predictions
        </Button2>
      </div>

      {isRunning && (
        <div className="mt-6 w-full">
          <div className="text-sm text-muted-foreground mb-2">
            Benchmark Running… {progress}%
          </div>
          <div className="w-full h-3 bg-muted rounded-lg overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}


      {showResult && runResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-lg border border-border max-w-lg w-full">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">
              Benchmark Completed
            </h2>

            <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(runResult, null, 2)}
            </pre>

            <div className="mt-6 flex justify-end">
              <Button2 variant="primary" onClick={() => setShowResult(false)}>
                Close
              </Button2>
            </div>
          </div>
        </div>
      )}


      {/* Footer */}
      <footer className="border-t bg-background mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2026 WebGenie Platform. MIT License.
            </p>

            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Built upon</span>
              <span className="text-primary">BEELINE</span>
              <span>Benchmarking Platform</span>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
