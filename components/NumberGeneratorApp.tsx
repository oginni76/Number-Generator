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

  const generateNumbers = () => {
    // Convert input to BigInt
    const start = BigInt(startNumber);
    const end = BigInt(endNumber);

    // Ensure start is less than or equal to end
    const startValue = start <= end ? start : end;
    const endValue = start <= end ? end : start;

    // Instead of creating the entire array, we'll create a limited view
    const MAX_DISPLAY_NUMBERS = 1000; // Limit display to prevent performance issues
    const numbers: string[] = [];

    let current = startValue;
    let count = 0;
    while (current <= endValue && count < MAX_DISPLAY_NUMBERS) {
      numbers.push(current.toString());
      current += BigInt(1);
      count++;
    }

    setGeneratedNumbers(numbers);
  };

  const downloadExcel = () => {
    // Generate full range for Excel export
    const start = BigInt(startNumber);
    const end = BigInt(endNumber);
    const startValue = start <= end ? start : end;
    const endValue = start <= end ? end : start;

    // Create an array of arrays for Excel export
    const excelData: string[][] = [];
    let current = startValue;
    while (current <= endValue) {
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
      <h1 className="text-2xl font-bold mb-4">Large Number Series Generator</h1>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="startNumber">Start Number</Label>
          <Input 
            id="startNumber"
            type="text" 
            value={startNumber} 
            onChange={(e) => setStartNumber(e.target.value)}
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
            onChange={(e) => setEndNumber(e.target.value)}
            className="mt-2"
            placeholder="Enter end number"
          />
        </div>
        
        <div className="flex space-x-4">
          <Button 
            onClick={generateNumbers}
            className="w-full"
          >
            Generate Numbers
          </Button>
          
          <Button 
            onClick={downloadExcel}
            disabled={generatedNumbers.length === 0}
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