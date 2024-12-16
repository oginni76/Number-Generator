'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as XLSX from 'xlsx';

export default function NumberGeneratorApp() {
  const [startNumber, setStartNumber] = useState<string>('1');
  const [endNumber, setEndNumber] = useState<string>('10');
  const [generatedNumbers, setGeneratedNumbers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateNumbers = () => {
    // Clear previous errors
    setError(null);

    // Convert input to BigInt
    const start = BigInt(startNumber);
    const end = BigInt(endNumber);

    // Validate that start is lower than end
    if (start >= end) {
      setError('Start number must be lower than end number');
      setGeneratedNumbers([]);
      return;
    }

    // Instead of creating the entire array, we'll create a limited view
    const MAX_DISPLAY_NUMBERS = 1000; // Limit display to prevent performance issues
    const numbers: string[] = [];

    let current = start;
    let count = 0;
    while (current < end && count < MAX_DISPLAY_NUMBERS) {
      numbers.push(current.toString());
      current += BigInt(1);
      count++;
    }

    setGeneratedNumbers(numbers);
  };

  const downloadExcel = () => {
    // Validate before export
    if (error) return;

    // Convert input to BigInt
    const start = BigInt(startNumber);
    const end = BigInt(endNumber);

    // Validate that start is lower than end
    if (start >= end) {
      setError('Start number must be lower than end number');
      return;
    }

    // Create an array of arrays for Excel export
    const excelData: string[][] = [];
    let current = start;
    while (current < end) {
      excelData.push([current.toString()]);
      current += BigInt(1);
    }

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Numbers');

    // Generate Excel file
    XLSX.writeFile(workbook, 'generated_numbers.xlsx');
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Number Series Generator</h1>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="startNumber">Start Number</Label>
          <Input 
            id="startNumber"
            type="text" 
            value={startNumber} 
            onChange={(e) => {
              setStartNumber(e.target.value);
              setError(null);
            }}
            className="mt-2"
            placeholder="Enter start number"
          />
        </div>
        
        <div>
          <Label htmlFor="endNumber">End Number</Label>
          <Input 
            id="endNumber"
            type="text" 
            value={endNumber} 
            onChange={(e) => {
              setEndNumber(e.target.value);
              setError(null);
            }}
            className="mt-2"
            placeholder="Enter end number"
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}
        
        <div className="flex space-x-4">
          <Button 
            onClick={generateNumbers}
            className="w-full"
          >
            Generate Numbers
          </Button>
          
          <Button 
            onClick={downloadExcel}
            disabled={generatedNumbers.length === 0 || !!error}
            className="w-full"
          >
            Download Excel
          </Button>
        </div>
        
        {generatedNumbers.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Generated Numbers (first {generatedNumbers.length}):</h2>
            <div className="border p-4 rounded overflow-auto max-h-40">
              {generatedNumbers.join(', ')}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Note: Only first 1000 numbers are displayed for performance reasons
            </p>
          </div>
        )}
      </div>
    </div>
  );
}