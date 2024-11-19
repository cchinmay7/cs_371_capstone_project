import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const GetStatsIris = () => {
  const [irisStats, setIrisStats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIrisStats();
  }, []);

  const fetchIrisStats = async () => {
    try {
      const response = await fetch('http://ec2-18-117-144-103.us-east-2.compute.amazonaws.com:8000/api/iris');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setIrisStats(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Iris Dataset Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Species</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Avg Sepal Length</TableHead>
                <TableHead>Avg Sepal Width</TableHead>
                <TableHead>Avg Petal Length</TableHead>
                <TableHead>Avg Petal Width</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {irisStats.map((stat, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{stat.species}</TableCell>
                  <TableCell>{stat.count}</TableCell>
                  <TableCell>{stat.avg_sepal_length}</TableCell>
                  <TableCell>{stat.avg_sepal_width}</TableCell>
                  <TableCell>{stat.avg_petal_length}</TableCell>
                  <TableCell>{stat.avg_petal_width}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default GetStatsIris;
