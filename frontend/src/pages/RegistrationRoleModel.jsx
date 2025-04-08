import React from 'react';
import { Check, ShieldAlert, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const RegistrationRoleModal = ({ isOpen, onClose, onSelectRole }) => {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Complete Your Profile</DialogTitle>
          <DialogDescription className="text-center">
            Choose how you want to use PralaySetu
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
          {/* Normal User Option */}
          <div 
            onClick={() => onSelectRole('normalUser')}
            className="border border-gray-200 hover:border-blue-500 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-md bg-white hover:bg-blue-50 flex flex-col items-center text-center group"
          >
            <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Users className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Normal User</h3>
            <p className="text-gray-600 text-sm">
              Receive alerts, access resources, and get help during emergencies
            </p>
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="outline" size="sm" className="rounded-full">
                <Check className="h-4 w-4 mr-1" /> Select
              </Button>
            </div>
          </div>
          
          {/* Responder Option */}
          <div 
            onClick={() => onSelectRole('responder')}
            className="border border-gray-200 hover:border-blue-500 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-md bg-white hover:bg-blue-50 flex flex-col items-center text-center group"
          >
            <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
              <ShieldAlert className="h-7 w-7 text-red-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Responder</h3>
            <p className="text-gray-600 text-sm">
              Volunteer your skills, join rescue efforts, and help communities in crisis
            </p>
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="outline" size="sm" className="rounded-full">
                <Check className="h-4 w-4 mr-1" /> Select
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col space-y-2 sm:space-y-0">
          <div className="text-xs text-gray-500 text-center mb-2">
            You can change your role later in profile settings
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationRoleModal;