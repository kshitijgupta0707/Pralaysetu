import React, { useState, useEffect } from "react";
import {
    Building,
    MapPin,
    Phone,
    Mail,
    Info,
    Edit,
    PlusCircle,
    DollarSign,
    Target,
    Calendar,
    BarChart,
    Menu,
    X,
    AlertCircle,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Trash2
} from "lucide-react";
import { toast } from "react-hot-toast";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNgoStore } from "@/store/useNgoStore";
import { useAuthStore } from "@/store/useAuthstore";
import { auth } from "@/firebase";
import { Link } from "react-router-dom";
const NGODashboard = () => {
    // State
    //   const {ngos} = useNgoStore();
    const { authUser } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isNewFundraiserOpen, setIsNewFundraiserOpen] = useState(false);
    const [isUpdateFundraiserOpen, setIsUpdateFundraiserOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [selectedFundraiser, setSelectedFundraiser] = useState(null);

    // Form states
    const [profileForm, setProfileForm] = useState({
        name: "",
        description: "",
        email: "",
        phone: "",
        address: ""
    });

    const [fundraiserForm, setFundraiserForm] = useState({
        title: "",
        description: "",
        goalAmount: 0,
        deadline: ""
    });

    // Get data from Zustand store
    const {
        ngo,
        setNGO,
        fundraisers,
        loading,
        error,
        fetchNGOById,
        updateNGO,
        createFundraiser,
        fetchFundraisers,
        updateFundraiser
    } = useNgoStore();

    const [ngoFundraisers , setNgoFundraisers] = useState([])
    const [activeFundraisers , setActiveFundraisers] = useState([])
    const [inactiveFundraisers , setInactiveFundraisers]= useState([])
    const [expiredFundraisers , setExpiredFundraisers]= useState([])
    
    const calculateFundraiserForNgo = () => {
        let ngoFundraisers = fundraisers.filter(
            fundraiser => fundraiser.ngoId._id === (ngo?._id || "")
        );
    
        // Get active, inactive, and expired fundraisers
        let activeFundraisers = ngoFundraisers.filter(f => f.isActive && !f.isExpired);
        let inactiveFundraisers = ngoFundraisers.filter(f => !f.isActive && !f.isExpired);
        let expiredFundraisers = ngoFundraisers.filter(f => f.isExpired);
        setNgoFundraisers(ngoFundraisers)
        setActiveFundraisers(activeFundraisers)
        setInactiveFundraisers(inactiveFundraisers)
        setExpiredFundraisers(expiredFundraisers)
    }
    //   const ngo = ngos[0] || null;

    // Fetch NGO data on component mount
    //   const ngo = null;
    useEffect(() => {
        if (authUser?._id) {
            fetchNGOById(authUser.ngoId);
            fetchFundraisers();
           
        }
    }, [authUser, fetchNGOById, fetchFundraisers]);
    useEffect(() => {
        calculateFundraiserForNgo()
    },[fundraisers])

    // Update profile form when ngo changes
    useEffect(() => {
        if (ngo) {
            setProfileForm({
                name: ngo.name || "",
                description: ngo.description || "",
                email: ngo.email || "",
                phone: ngo.phone || "",
                address: ngo.address || ""
            });
        }
    }, [ngo]);

    // // Filter fundraisers by NGO ID
    // let ngoFundraisers = fundraisers.filter(
    //     fundraiser => fundraiser.ngoId._id === (ngo?._id || "")
    // );

    // // Get active, inactive, and expired fundraisers
    // let activeFundraisers = ngoFundraisers.filter(f => f.isActive && !f.isExpired);
    // let inactiveFundraisers = ngoFundraisers.filter(f => !f.isActive && !f.isExpired);
    // let expiredFundraisers = ngoFundraisers.filter(f => f.isExpired);

    // Form handlers
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFundraiserChange = (e) => {
        const { name, value } = e.target;
        setFundraiserForm(prev => ({ ...prev, [name]: value }));
    };

    // Action handlers
    const saveProfileChanges = async () => {
        if (ngo?._id) {
            await updateNGO(ngo._id, profileForm);
            setNGO({...ngo, ...profileForm})
            setIsEditProfileOpen(false);
        }
    };

    const handleCreateFundraiser = async () => {
        if (!ngo?._id) return;

        const { title, description, goalAmount, deadline } = fundraiserForm;
        console.log(deadline)
        if (!title || !description || !goalAmount || !deadline) {
            toast.error("All fields are required");
            return;
        }
        // Validate goal amount
        if (goalAmount <= 0 || goalAmount < 20000) {
            toast.error("Goal amount must be greater than 20,000");
            return;
        }
        
        // Validate deadline format and future date
        const deadlineDate = new Date(deadline);
        const now = new Date();
        const year = Number(deadline.split("-")[0])

        if (
            isNaN(deadlineDate.getTime()) || // invalid date
            deadlineDate <= now           // date is not in the future
          
        ) {
            toast.error("Please enter a valid deadline date ");
            return;
        }
        if(year > 2026){
            toast.error("Please enter a valid deadline date in the future (before 2026)");
            return;
        }

        // Create fundraiser
        const fundraiserData = {
            title,
            description,
            goalAmount,
            deadline,
            ngoId: ngo._id
        };

       await createFundraiser(fundraiserData);
       
       calculateFundraiserForNgo()
        // Reset form
        setFundraiserForm({
            title: "",
            description: "",
            goalAmount: 0,
            deadline: ""
        });
        setIsNewFundraiserOpen(false);
    };


    const handleEditFundraiser = (fundraiser) => {
        setSelectedFundraiser(fundraiser);
        setFundraiserForm({
            title: fundraiser.title,
            description: fundraiser.description,
            goalAmount: fundraiser.goalAmount,
            deadline: fundraiser.deadline ? new Date(fundraiser.deadline).toISOString().split('T')[0] : ""
        });
        setIsUpdateFundraiserOpen(true);
    };

    const handleUpdateFundraiser = async () => {
        if (selectedFundraiser?._id) {
            await updateFundraiser(selectedFundraiser._id, fundraiserForm);
            setIsUpdateFundraiserOpen(false);
            setSelectedFundraiser(null);
        }
    };

    const handleToggleFundraiserStatus = async (fundraiser) => {
        await updateFundraiser(fundraiser._id, {
            isActive: !fundraiser.isActive
        });
    };



    // Display fundraisers based on active tab
    const displayFundraisers = () => {
        switch (activeTab) {
            case "active":
                return activeFundraisers;
            case "inactive":
                return inactiveFundraisers;
            case "expired":
                return expiredFundraisers;
            default:
                return ngoFundraisers;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 ">
            {/* Mobile Menu Button */}
            { !sidebarOpen && <div className="md:hidden fixed top-6 left-3 z-50 ">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="rounded-full shadow-md bg-white"
                >
                    <Menu className="h-5 w-5" />
                </Button>

                
            </div>}
         
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0    bg-opacity-50  backdrop-blur-xs  z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="h-full flex flex-col overflow-y-auto">
                    <Link to={"/"} >
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-bold text-blue-800">NGO Dashboard</h2>
                    </div>
                    </Link>

                    <div className="p-4 border-b">
                        <div className="flex items-center mb-2 font-medium text-blue-800">
                            <Building className="h-4 w-4 mr-2" /> {ngo?.name}
                        </div>
                        <div className="text-sm text-gray-600 mb-4">{ngo?.description}</div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => setIsEditProfileOpen(true)}
                        >
                            <Edit className="h-4 w-4 mr-1" /> Edit Profile
                        </Button>
                    </div>

                    <div className="p-4 space-y-4">
                        <h3 className="font-semibold text-gray-700">Quick Stats</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-blue-50 p-2 rounded border border-blue-100">
                                <div className="text-xs text-gray-500">Fundraisers</div>
                                <div className="text-lg font-bold text-blue-800">{ngoFundraisers.length}</div>
                            </div>
                            <div className="bg-green-50 p-2 rounded border border-green-100">
                                <div className="text-xs text-gray-500">Total Raised</div>
                                <div className="text-lg font-bold text-green-700">₹{ngo?.totalFundsReceived?.toLocaleString() || "0"}</div>
                            </div>
                            <div className="bg-orange-50 p-2 rounded border border-orange-100">
                                <div className="text-xs text-gray-500">Active</div>
                                <div className="text-lg font-bold text-orange-700">{activeFundraisers.length}</div>
                            </div>
                            <div className="bg-red-50 p-2 rounded border border-red-100">
                                <div className="text-xs text-gray-500">Expired</div>
                                <div className="text-lg font-bold text-red-700">{expiredFundraisers.length}</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto p-4 border-t">
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                                setIsNewFundraiserOpen(true);
                                setSidebarOpen(false);
                            }}
                        >
                            <PlusCircle className="h-4 w-4 mr-1" /> New Fundraiser
                        </Button>
                    </div>
                </div>
                { sidebarOpen && <div className="md:hidden fixed top-2   left-52 -right-6 z-50 ">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="rounded-full shadow-md bg-white"
                >
                     <X className="h-5 w-5" />
                </Button>

                
            </div>}
 
            </div>

            {/* Main Content */}
            <div className="md:ml-64">
                {/* Header */}
                <header className="bg-white shadow">
                    <div className="container px-4 py-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-blue-800 hidden md:block">Fundraising Campaigns</h1>
                            <h1 className="text-xl font-bold text-blue-800 md:hidden ml-10">Campaigns</h1>
                            <Button
                                onClick={() => setIsNewFundraiserOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <PlusCircle className="h-4 w-4 mr-2" /> New
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="container px-4 py-6">
                    {/* NGO Profile Summary Card - Desktop only */}
                    <Card className="shadow-lg mb-6 hidden md:block ">
                        <CardHeader className="bg-blue-50 border-b border-blue-100 p-3">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-blue-800">{ngo?.name}</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsEditProfileOpen(true)}
                                >
                                    <Edit className="h-4 w-4 mr-1" /> Edit
                                </Button>
                            </div>
                            <CardDescription>{ngo?.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-4 pt-4">
                            <div className="flex items-start">
                                <Mail className="h-4 w-4 mr-2 mt-1 text-blue-600" />
                                <div>
                                    <div className="text-sm font-medium">Email</div>
                                    <div className="text-sm text-gray-600">{ngo?.email}</div>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Phone className="h-4 w-4 mr-2 mt-1 text-blue-600" />
                                <div>
                                    <div className="text-sm font-medium">Phone</div>
                                    <div className="text-sm text-gray-600">{ngo?.phone || "Not specified"}</div>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <MapPin className="h-4 w-4 mr-2 mt-1 text-blue-600" />
                                <div>
                                    <div className="text-sm font-medium">Address</div>
                                    <div className="text-sm text-gray-600">{ngo?.address || "Not specified"}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Fundraisers Tabs */}
                    <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-4 mb-4">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="active">Active</TabsTrigger>
                            <TabsTrigger value="inactive">Inactive</TabsTrigger>
                            <TabsTrigger value="expired">Expired</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Fundraisers List */}
                    {displayFundraisers().length === 0 ? (
                        <Card className="shadow-md text-center p-8">
                            <div className="flex flex-col items-center justify-center">
                                <AlertCircle className="h-10 w-10 text-gray-400 mb-4" />
                                <p className="text-gray-500 mb-4">No fundraisers found in this category.</p>
                                <Button
                                    onClick={() => setIsNewFundraiserOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <PlusCircle className="h-4 w-4 mr-1" /> Create New Fundraiser
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {displayFundraisers().map((fundraiser) => (
                                <Card key={fundraiser._id} className="shadow-md">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>{fundraiser.title}</CardTitle>
                                                <CardDescription className="flex items-center gap-2 mt-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Created: {new Date(fundraiser.createdAt).toLocaleDateString()} |
                                                    Deadline: {new Date(fundraiser.deadline).toLocaleDateString()}
                                                </CardDescription>
                                            </div>
                                            <div className="flex flex-col items-end space-y-1">
                                                {fundraiser.isExpired ? (
                                                    <Badge variant="destructive">Expired</Badge>
                                                ) : fundraiser.isActive ? (
                                                    <Badge variant="default" className="bg-green-600">Active</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="border-gray-400 text-gray-500">Inactive</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 mb-4">{fundraiser?.description}</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium">Progress</span>
                                                <span className="text-green-600 font-medium">
                                                    ₹{fundraiser.raisedAmount?.toLocaleString() || "0"} of ₹{fundraiser?.goalAmount.toLocaleString()}
                                                </span>
                                            </div>
                                            <Progress
                                                value={(fundraiser.raisedAmount / fundraiser.goalAmount) * 100 || 0}
                                                className="h-2"
                                            />
                                            <div className="flex justify-end text-xs text-gray-500">
                                                {Math.round((fundraiser.raisedAmount / fundraiser.goalAmount) * 100) || 0}% complete
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="border-t pt-4 flex justify-between flex-wrap gap-2">
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">
                                                <BarChart className="h-4 w-4 mr-1" /> Analytics
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEditFundraiser(fundraiser)}
                                            >
                                                <Edit className="h-4 w-4 mr-1" /> Edit
                                            </Button>
                                        </div>
                                        <div>
                                            {!fundraiser.isExpired && (
                                                <Button
                                                    size="sm"
                                                    variant={fundraiser.isActive ? "destructive" : "default"}
                                                    className={fundraiser.isActive ? "" : "bg-green-600 hover:bg-green-700"}
                                                    onClick={() => handleToggleFundraiserStatus(fundraiser)}
                                                >
                                                    {fundraiser.isActive ? "Deactivate" : "Activate"}
                                                </Button>
                                            )}
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </main>
            </div>

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
                                value={profileForm.name}
                                onChange={handleProfileChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">Description</label>
                            <Textarea
                                id="description"
                                name="description"
                                value={profileForm.description}
                                onChange={handleProfileChange}
                                rows={4}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={profileForm.email}
                                disabled
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                            <Input
                                id="phone"
                                name="phone"
                                value={profileForm.phone}
                                onChange={handleProfileChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="address" className="text-sm font-medium">Address</label>
                            <Textarea
                                id="address"
                                name="address"
                                value={profileForm.address}
                                onChange={handleProfileChange}
                                rows={2}
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
                                value={fundraiserForm.title}
                                onChange={handleFundraiserChange}
                                placeholder="e.g., Flood Relief Fund"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">Description</label>
                            <Textarea
                                id="description"
                                name="description"
                                value={fundraiserForm.description}
                                onChange={handleFundraiserChange}
                                rows={4}
                                placeholder="Describe your fundraising campaign and how the funds will be used..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="goalAmount" className="text-sm font-medium">Target Amount (₹)</label>
                                <Input
                                    id="goalAmount"
                                    name="goalAmount"
                                    type="number"
                                    value={fundraiserForm.goalAmount}
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
                                    value={fundraiserForm.deadline}
                                    onChange={handleFundraiserChange}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsNewFundraiserOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateFundraiser} className="bg-blue-600 hover:bg-blue-700">Create Fundraiser</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Update Fundraiser Dialog */}
            <Dialog open={isUpdateFundraiserOpen} onOpenChange={setIsUpdateFundraiserOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Update Fundraiser</DialogTitle>
                        <DialogDescription>
                            Edit details for this fundraising campaign.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="update-title" className="text-sm font-medium">Campaign Title</label>
                            <Input
                                id="update-title"
                                name="title"
                                value={fundraiserForm.title}
                                onChange={handleFundraiserChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="update-description" className="text-sm font-medium">Description</label>
                            <Textarea
                                id="update-description"
                                name="description"
                                value={fundraiserForm.description}
                                onChange={handleFundraiserChange}
                                rows={4}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="update-goalAmount" className="text-sm font-medium">Target Amount (₹)</label>
                                <Input
                                    id="update-goalAmount"
                                    name="goalAmount"
                                    type="number"
                                    value={fundraiserForm.goalAmount}
                                    onChange={handleFundraiserChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="update-deadline" className="text-sm font-medium">Deadline</label>
                                <Input
                                    id="update-deadline"
                                    name="deadline"
                                    type="date"
                                    value={fundraiserForm.deadline}
                                    onChange={handleFundraiserChange}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUpdateFundraiserOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateFundraiser} className="bg-blue-600 hover:bg-blue-700">Update Fundraiser</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export { NGODashboard };

