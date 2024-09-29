import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";

// Define the profile interface for TypeScript type checking
interface ProfileData {
  firstName: string;
  lastName: string;
  birthday: string;
  gender: string;
  role: string;
  email: string;
}

export default function ProfileForm() {
  // Define state for form fields
  const [profile, setProfile] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    birthday: '',
    gender: '',
    role: '', // Default value (can be set later)
    email: ''
  });

  // Define state for form submission feedback and loading status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Function to fetch profile data when the component loads
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); // Ensure you have the token stored in localStorage
        if (!token) {
          throw new Error('No authentication token found. Please login.');
        }

        // Fetch profile data using the token
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in headers
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data: ProfileData = await response.json();

        // Debugging: log the received data
        console.log("Fetched profile data:", data);

        // Set the profile data in state to populate the form
        setProfile(data);
        setFetchError(null); // Reset any previous errors
      } catch (err: unknown) {
        if (err instanceof Error) {
          setFetchError(err.message);
        } else {
          setFetchError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.id]: e.target.value });
  };

  // Handle Select change for gender
  const handleGenderChange = (gender: string) => {
    setProfile({ ...profile, gender });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token'); // Ensure you have the token stored in localStorage
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in headers
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await response.json();
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Update Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Display error if fetching profile data failed */}
        {fetchError && <p className="text-red-500">{fetchError}</p>}

        {/* Form Start */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={handleInputChange}
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthday">Birthday</Label>
            <div className="relative">
              <Input
                id="birthday"
                type="date"
                value={profile.birthday}
                onChange={handleInputChange}
                className="pl-10"
                required
              />
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select onValueChange={handleGenderChange} value={profile.gender}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={profile.role}
              readOnly
              className="cursor-not-allowed"
              placeholder="Software Developer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={handleInputChange}
              placeholder="john.doe@example.com"
              required
            />
          </div>
          {/* Form Submission Feedback */}
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">Profile updated successfully!</p>}
          {/* Submit Button */}
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </CardFooter>
        </form>
        {/* Form End */}
      </CardContent>
    </Card>
  );
}
