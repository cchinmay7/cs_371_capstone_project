import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const UpdateIris = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [formData, setFormData] = useState({
    sepal_length: '',
    sepal_width: '',
    petal_length: '',
    petal_width: '',
    species: ''
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://ec2-18-117-144-103.us-east-2.compute.amazonaws.com:8000/api/iris/${serialNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Iris record not found');
        }
        throw new Error('Failed to update iris data');
      }
      
      const data = await response.json();
      setMessage('Iris data updated successfully!');
      setError(null);
    } catch (err) {
      setError(err.message);
      setMessage(null);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Update Iris Record</CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert className="mb-4 bg-green-100">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert className="mb-4 bg-red-100">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Serial Number:</label>
              <Input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                required
                className="mb-4"
              />
            </div>

            <div>
              <label className="block mb-2">Sepal Length:</label>
              <Input
                type="number"
                step="0.1"
                name="sepal_length"
                value={formData.sepal_length}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block mb-2">Sepal Width:</label>
              <Input
                type="number"
                step="0.1"
                name="sepal_width"
                value={formData.sepal_width}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block mb-2">Petal Length:</label>
              <Input
                type="number"
                step="0.1"
                name="petal_length"
                value={formData.petal_length}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block mb-2">Petal Width:</label>
              <Input
                type="number"
                step="0.1"
                name="petal_width"
                value={formData.petal_width}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block mb-2">Species:</label>
              <Input
                type="text"
                name="species"
                value={formData.species}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Update Iris Record
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateIris;