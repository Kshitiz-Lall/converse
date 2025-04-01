import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { format } from 'date-fns';
import { CalendarIcon, CreditCard, Home, Loader2, Mail, Phone, Upload, User } from 'lucide-react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Define form schema
const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  address: z.string().optional(),
  profilePicture: z
    .string()
    .refine(val => !val || val.startsWith('data:image/'), {
      message: 'Must be a valid image data URL',
    })
    .optional(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

// Define preferences schema
const preferencesSchema = z.object({
  language: z.string(),
  theme: z.enum(['light', 'dark']),
  notifications: z.boolean(),
});

// Define social media schema
const socialMediaSchema = z.object({
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
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
  phone?: string;
  address?: string;
  profilePicture?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  role?: 'user' | 'admin' | 'moderator';
  preferences?: {
    language: string;
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  paymentDetails?: {
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
  };
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize profile form
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      gender: undefined,
    },
  });

  // Initialize preferences form
  const preferencesForm = useForm<z.infer<typeof preferencesSchema>>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      language: 'en',
      theme: 'light',
      notifications: true,
    },
  });

  // Initialize social media form
  const socialMediaForm = useForm<z.infer<typeof socialMediaSchema>>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      facebook: '',
      twitter: '',
      linkedin: '',
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
        if (response.data.profilePicture) {
          setPreviewImage(response.data.profilePicture);
        }

        // Set form values
        profileForm.reset({
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          dateOfBirth: response.data.dateOfBirth ? new Date(response.data.dateOfBirth) : undefined,
          gender: response.data.gender || undefined,
        });

        preferencesForm.reset({
          language: response.data.preferences?.language || 'en',
          theme: response.data.preferences?.theme || 'light',
          notifications: response.data.preferences?.notifications || true,
        });

        socialMediaForm.reset({
          facebook: response.data.socialMedia?.facebook || '',
          twitter: response.data.socialMedia?.twitter || '',
          linkedin: response.data.socialMedia?.linkedin || '',
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

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File too large', {
          description: 'Please select an image smaller than 2MB',
        });
        return;
      }

      // Check file type
      if (!file.type.match('image.*')) {
        toast.error('Invalid file type', {
          description: 'Please select an image file (JPEG, PNG, etc.)',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          const base64String = event.target.result as string;
          setPreviewImage(base64String);
          profileForm.setValue('profilePicture', base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onProfileSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

      // Prepare the data to send
      const profileData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        profilePicture: data.profilePicture,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
      };

      const response = await axios.put('http://localhost:3000/api/auth/profile', profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          ...response.data.user,
        });
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile', {
        description: 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const onPreferencesSubmit = async (data: z.infer<typeof preferencesSchema>) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

      await axios.put(
        'http://localhost:3000/api/auth/profile',
        {
          preferences: data,
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
          preferences: data,
        });
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSocialMediaSubmit = async (data: z.infer<typeof socialMediaSchema>) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

      await axios.put(
        'http://localhost:3000/api/auth/profile',
        {
          socialMedia: data,
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
          socialMedia: data,
        });
      }
    } catch (error) {
      console.error('Error updating social media:', error);
    } finally {
      setLoading(false);
    }
  };

  const onPaymentSubmit = async (data: z.infer<typeof paymentSchema>) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

      await axios.put('http://localhost:3000/api/auth/payment-details', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          paymentDetails: {
            cardNumber: data.cardNumber || undefined,
            expiryDate: data.expiryDate || undefined,
            cvv: data.cvv || undefined,
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
  const maskCardNumber = (cardNumber?: string) => {
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
              <label className="block mb-4 w-full aspect-square overflow-hidden rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {previewImage ? (
                  <div className="relative w-full h-full group">
                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="h-8 w-8 text-white" />
                      <span className="sr-only">Upload new photo</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400">
                      Click to upload profile photo
                    </span>
                    <span className="text-4xl text-gray-400">
                      {profile ? getInitials(profile.name) : 'U'}
                    </span>
                  </div>
                )}
              </label>
              <CardTitle className="text-2xl">{profile?.name}</CardTitle>
              <CardDescription>{profile?.email}</CardDescription>
              {profile?.role && (
                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                  {profile.role}
                </span>
              )}
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
                {profile?.dateOfBirth && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                    <span>{format(new Date(profile.dateOfBirth), 'PPP')}</span>
                  </div>
                )}
                {profile?.gender && (
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="capitalize">{profile.gender}</span>
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
                  Member since {new Date(profile?.createdAt || '').toLocaleDateString()}
                </p>
                {profile?.lastLogin && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Last active: {new Date(profile.lastLogin).toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-2/3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of Birth</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'w-full pl-3 text-left font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, 'PPP')
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={date =>
                                    date > new Date() || date < new Date('1900-01-01')
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={loading || uploading} className="w-full">
                        {loading || uploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {uploading ? 'Uploading Image...' : 'Updating Profile'}
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

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...preferencesForm}>
                    <form
                      onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={preferencesForm.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="de">German</SelectItem>
                                <SelectItem value="it">Italian</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={preferencesForm.control}
                        name="theme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Theme</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select theme" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={preferencesForm.control}
                        name="notifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Notifications</FormLabel>
                              <FormDescription>Receive email notifications</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={loading} className="w-full">
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating Preferences
                          </>
                        ) : (
                          'Update Preferences'
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                  <CardDescription>Connect your social accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...socialMediaForm}>
                    <form
                      onSubmit={socialMediaForm.handleSubmit(onSocialMediaSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={socialMediaForm.control}
                        name="facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook</FormLabel>
                            <FormControl>
                              <Input placeholder="https://facebook.com/username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={socialMediaForm.control}
                        name="twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Twitter</FormLabel>
                            <FormControl>
                              <Input placeholder="https://twitter.com/username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={socialMediaForm.control}
                        name="linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn</FormLabel>
                            <FormControl>
                              <Input placeholder="https://linkedin.com/in/username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={loading} className="w-full">
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating Social Media
                          </>
                        ) : (
                          'Update Social Media'
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
