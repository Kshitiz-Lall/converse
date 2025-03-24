import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { CreditCard, Home, Loader2, Mail, Phone } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Define form schema
const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// Define payment schema
const paymentSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, { message: 'Card number must be 16 digits.' })
    .optional()
    .or(z.literal('')),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Expiry date must be in MM/YY format.' })
    .optional()
    .or(z.literal('')),
  cvv: z
    .string()
    .regex(/^\d{3,4}$/, { message: 'CVV must be 3 or 4 digits.' })
    .optional()
    .or(z.literal('')),
});

interface ProfileData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentDetails: {
    cardNumber: string | null;
    expiryDate: string | null;
    cvv: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize profile form
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  // Initialize payment form
  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data);

        // Set form values
        profileForm.reset({
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
        });

        paymentForm.reset({
          cardNumber: response.data.paymentDetails?.cardNumber || '',
          expiryDate: response.data.paymentDetails?.expiryDate || '',
          cvv: response.data.paymentDetails?.cvv || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const onProfileSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

      await axios.put('http://localhost:3000/api/auth/profile', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          ...data,
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const onPaymentSubmit = async (data: z.infer<typeof paymentSchema>) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

      await axios.put(
        'http://localhost:3000/api/auth/payment-details',
        {
          paymentDetails: data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          paymentDetails: {
            cardNumber: data.cardNumber || null,
            expiryDate: data.expiryDate || null,
            cvv: data.cvv || null,
          },
        });
      }
    } catch (error) {
      console.error('Error updating payment details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to mask card number
  const maskCardNumber = (cardNumber: string | null) => {
    if (!cardNumber) return '';
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">
                    {profile ? getInitials(profile.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">{profile?.name}</CardTitle>
              <CardDescription>{profile?.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>{profile?.email}</span>
                </div>
                {profile?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile?.address && (
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-muted-foreground" />
                    <span>{profile.address}</span>
                  </div>
                )}
                {profile?.paymentDetails?.cardNumber && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span>{maskCardNumber(profile.paymentDetails.cardNumber)}</span>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <p className="text-sm text-muted-foreground">
                  Account created on {new Date(profile?.createdAt || '').toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-2/3">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile Details</TabsTrigger>
              <TabsTrigger value="payment">Payment Information</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Your phone number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Optional: Add your phone number for contact purposes
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Your address" {...field} />
                            </FormControl>
                            <FormDescription>
                              Optional: Add your address for shipping purposes
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={loading} className="w-full">
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating Profile
                          </>
                        ) : (
                          'Update Profile'
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>Update your payment details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...paymentForm}>
                    <form
                      onSubmit={paymentForm.handleSubmit(onPaymentSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={paymentForm.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input placeholder="1234 5678 9012 3456" {...field} maxLength={16} />
                            </FormControl>
                            <FormDescription>Enter your 16-digit card number</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={paymentForm.control}
                          name="expiryDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YY" {...field} maxLength={5} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={paymentForm.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV</FormLabel>
                              <FormControl>
                                <Input placeholder="123" {...field} maxLength={4} type="password" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" disabled={loading} className="w-full">
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating Payment Details
                          </>
                        ) : (
                          'Update Payment Information'
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
