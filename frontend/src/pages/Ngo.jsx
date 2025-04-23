import React, { useState, useEffect } from "react";
import {
  Building,
  MapPin,
  Phone,
  Info,
  Edit,
  PlusCircle,
  DollarSign,
  Target,
  Calendar,
  BarChart
} from "lucide-react";
// import { Button } from "./ui/button";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

const NGODashboard = ({ authUser }) => {
  const [ngoData, setNgoData] = useState(null);
  const [fundraisers, setFundraisers] = useState([]);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isNewFundraiserOpen, setIsNewFundraiserOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    contact: ""
  });
  const [newFundraiser, setNewFundraiser] = useState({
    title: "",
    description: "",
    targetAmount: 0,
    deadline: ""
  });

  // Simulating fetching NGO data
  useEffect(() => {
    // In a real application, this would be an API call
    const fetchData = async () => {
      // Simulated data
      const data = {
        _id: "12345",
        userId: authUser?._id || "user123",
        name: "Helping Hands Foundation",
        description: "We are dedicated to providing disaster relief and recovery support to affected communities across the country.",
        location: "Mumbai, Maharashtra",
        contact: "+91 98765 43210",
        totalReceived: 125000
      };
      setNgoData(data);
      setFormData(data);

      // Simulated fundraisers
      const fundraisersData = [
        {
          _id: "f1",
          title: "Flood Relief in Kerala",
          description: "Supporting communities affected by severe flooding in Kerala with emergency supplies and temporary shelters.",
          targetAmount: 500000,
          currentAmount: 320000,
          deadline: "2025-06-30",
          createdAt: "2025-03-15"
        },
        {
          _id: "f2",
          title: "Cyclone Recovery Efforts",
          description: "Rebuilding infrastructure and providing essential supplies to families affected by the recent cyclone.",
          targetAmount: 300000,
          currentAmount: 150000,
          deadline: "2025-05-15",
          createdAt: "2025-02-20"
        }
      ];
      setFundraisers(fundraisersData);
    };

    fetchData();
  }, [authUser]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFundraiserChange = (e) => {
    const { name, value } = e.target;
    setNewFundraiser({ ...newFundraiser, [name]: value });
  };

  const saveProfileChanges = async () => {
    // In a real application, this would be an API call to update the NGO profile
    setNgoData(formData);
    setIsEditProfileOpen(false);
  };

  const createFundraiser = async () => {
    // In a real application, this would be an API call to create a new fundraiser
    const newFundraiserData = {
      _id: `${fundraisers.length + 1}`,
      ...newFundraiser,
      currentAmount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setFundraisers([...fundraisers, newFundraiserData]);
    setIsNewFundraiserOpen(false);
    setNewFundraiser({
      title: "",
      description: "",
      targetAmount: 0,
      deadline: ""
    });
  };

  if (!ngoData) {
    return <div className="container mx-auto p-8">Loading NGO data...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-blue-800">NGO Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid md:grid-cols-3 gap-8">
          {/* NGO Profile Card */}
          <div className="md:col-span-1">
            <Card className="shadow-lg">
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-blue-800">NGO Profile</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsEditProfileOpen(true)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </div>
                <CardDescription>Your organization details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-1">
                  <div className="flex items-center text-blue-800 font-medium">
                    <Building className="h-4 w-4 mr-2" /> Organization
                  </div>
                  <p className="pl-6">{ngoData.name}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-blue-800 font-medium">
                    <Info className="h-4 w-4 mr-2" /> Description
                  </div>
                  <p className="pl-6 text-sm text-gray-600">{ngoData.description}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-blue-800 font-medium">
                    <MapPin className="h-4 w-4 mr-2" /> Location
                  </div>
                  <p className="pl-6">{ngoData.location}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-blue-800 font-medium">
                    <Phone className="h-4 w-4 mr-2" /> Contact
                  </div>
                  <p className="pl-6">{ngoData.contact}</p>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <div className="w-full">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Total Funds Received</span>
                    <span className="text-blue-800 font-bold">₹{ngoData.totalReceived.toLocaleString()}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>

            {/* Stats Card */}
            <Card className="shadow-lg mt-6">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <CardTitle className="text-green-800">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <div className="text-sm text-gray-500">Active Fundraisers</div>
                    <div className="text-2xl font-bold text-blue-800">{fundraisers.length}</div>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <div className="text-sm text-gray-500">Total Goal</div>
                    <div className="text-2xl font-bold text-blue-800">
                      ₹{fundraisers.reduce((acc, curr) => acc + curr.targetAmount, 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <div className="text-sm text-gray-500">Funds Raised</div>
                    <div className="text-2xl font-bold text-green-600">
                      ₹{fundraisers.reduce((acc, curr) => acc + curr.currentAmount, 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <div className="text-sm text-gray-500">Avg. Completion</div>
                    <div className="text-2xl font-bold text-orange-500">
                      {fundraisers.length > 0 
                        ? Math.round(fundraisers.reduce((acc, curr) => acc + (curr.currentAmount / curr.targetAmount * 100), 0) / fundraisers.length)
                        : 0}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fundraisers Section */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Your Fundraising Campaigns</h2>
              <Button 
                onClick={() => setIsNewFundraiserOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> New Fundraiser
              </Button>
            </div>

            {fundraisers.length === 0 ? (
              <Card className="shadow text-center p-8">
                <p className="text-gray-500">You haven't created any fundraisers yet.</p>
                <Button 
                  onClick={() => setIsNewFundraiserOpen(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Create Your First Fundraiser
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {fundraisers.map((fundraiser) => (
                  <Card key={fundraiser._id} className="shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between">
                        <CardTitle>{fundraiser.title}</CardTitle>
                        <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Active
                        </div>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" /> 
                        Created: {fundraiser.createdAt} | Deadline: {fundraiser.deadline}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{fundraiser.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Progress</span>
                          <span className="text-green-600 font-medium">
                            ₹{fundraiser.currentAmount.toLocaleString()} of ₹{fundraiser.targetAmount.toLocaleString()}
                          </span>
                        </div>
                        <Progress 
                          value={(fundraiser.currentAmount / fundraiser.targetAmount) * 100} 
                          className="h-2" 
                        />
                        <div className="flex justify-end text-xs text-gray-500">
                          {Math.round((fundraiser.currentAmount / fundraiser.targetAmount) * 100)}% complete
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between">
                      <Button variant="outline" size="sm">
                        <BarChart className="h-4 w-4 mr-1" /> View Analytics
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Edit className="h-4 w-4 mr-1" /> Manage
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit NGO Profile</DialogTitle>
            <DialogDescription>
              Update your organization's information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Organization Name</label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleProfileChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleProfileChange}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Location</label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleProfileChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact" className="text-sm font-medium">Contact Information</label>
              <Input
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleProfileChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>Cancel</Button>
            <Button onClick={saveProfileChanges} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Fundraiser Dialog */}
      <Dialog open={isNewFundraiserOpen} onOpenChange={setIsNewFundraiserOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Fundraiser</DialogTitle>
            <DialogDescription>
              Provide details about your fundraising campaign.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Campaign Title</label>
              <Input
                id="title"
                name="title"
                value={newFundraiser.title}
                onChange={handleFundraiserChange}
                placeholder="Flood Relief Fund"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                name="description"
                value={newFundraiser.description}
                onChange={handleFundraiserChange}
                rows={4}
                placeholder="Describe your fundraising campaign and how the funds will be used..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="targetAmount" className="text-sm font-medium">Target Amount (₹)</label>
                <Input
                  id="targetAmount"
                  name="targetAmount"
                  type="number"
                  value={newFundraiser.targetAmount}
                  onChange={handleFundraiserChange}
                  placeholder="500000"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="deadline" className="text-sm font-medium">Deadline</label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={newFundraiser.deadline}
                  onChange={handleFundraiserChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFundraiserOpen(false)}>Cancel</Button>
            <Button onClick={createFundraiser} className="bg-blue-600 hover:bg-blue-700">Create Fundraiser</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NGODashboard;