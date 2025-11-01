import React, { useState } from 'react';
import { User, Key, Edit, Save, X, Trash2 } from 'lucide-react';
import { userAPI } from '../../services/api';
import DeleteConfirmationDialog from '../common/DeleteConfirmationDialog.jsx';

const Profile = ({ user, onUpdate, onDelete }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      setErrorMessage('Name cannot be empty');
      return;
    }

    setIsUpdating(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Send all fields with new name and old values for username and password
      const updateData = {
        name: newName,
        loginId: user.loginId,
        password: user.password || ''
      };
      
      await userAPI.updateUser(user.id, updateData);
      setSuccessMessage('Name updated successfully');
      
      if (onUpdate) {
        onUpdate({ ...user, name: newName });
      }
      
      setActiveModal(null);
      setNewName('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating name:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to update name. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      setErrorMessage('Username cannot be empty');
      return;
    }

    setIsUpdating(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Send all fields with new username and old values for name and password
      const updateData = {
        name: user.name,
        loginId: newUsername,
        password: user.password || ''
      };
      
      await userAPI.updateUser(user.id, updateData);
      setSuccessMessage('Username updated successfully');
      
      if (onUpdate) {
        onUpdate({ ...user, loginId: newUsername });
      }
      
      setActiveModal(null);
      setNewUsername('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating username:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to update username. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword.trim()) {
      setErrorMessage('Password cannot be empty');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    setIsUpdating(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Send all fields with new password and old values for name and username
      const updateData = {
        name: user.name,
        loginId: user.loginId,
        password: newPassword
      };
      
      await userAPI.updateUser(user.id, updateData);
      setSuccessMessage('Password updated successfully');
      
      setActiveModal(null);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to update password. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setNewName('');
    setNewUsername('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeletingAccount(true);
      setErrorMessage('');
      
      await userAPI.deleteUser(user.id);
      
      // If onDelete callback is provided, call it (which should log out the user)
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to delete account. Please try again.');
      setShowDeleteAccountDialog(false);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
            <p className="text-sm text-gray-500">Manage your account information and preferences</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <p className="text-sm font-medium text-green-800">{successMessage}</p>
          <button onClick={() => setSuccessMessage('')} className="text-green-600 hover:text-green-800">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <p className="text-sm font-medium text-red-800">{errorMessage}</p>
          <button onClick={() => setErrorMessage('')} className="text-red-600 hover:text-red-800">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Profile Info Display */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
        </div>
        <div className="p-6 space-y-6">
          {/* Username Display */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="text-lg font-semibold text-gray-900">{user?.loginId || 'N/A'}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveModal('username')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-200"
            >
              <Edit className="h-4 w-4" />
              <span>Change</span>
            </button>
          </div>

          {/* Name Display */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-lg font-semibold text-gray-900">{user?.name || 'N/A'}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveModal('name')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-200"
            >
              <Edit className="h-4 w-4" />
              <span>Change</span>
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Button */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <button
          onClick={() => setActiveModal('password')}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-200"
        >
          <Key className="h-5 w-5" />
          <span>Change Password</span>
        </button>
      </div>

      {/* Delete Account Section */}
      <div className="bg-white rounded-lg shadow-sm border-2 border-red-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Delete Account</h3>
            <p className="text-sm text-gray-600">Permanently delete your account and all associated data</p>
          </div>
          <button
            onClick={() => setShowDeleteAccountDialog(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Trash2 className="h-5 w-5" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {/* Change Name Modal */}
      {activeModal === 'name' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Change Name</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="newName" className="block text-sm font-medium text-gray-700 mb-2">
                  New Name
                </label>
                <input
                  type="text"
                  id="newName"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Enter new name"
                />
              </div>
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              )}
              <div className="flex items-center space-x-4 pt-4">
                <button
                  onClick={handleUpdateName}
                  disabled={isUpdating}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  <span>{isUpdating ? 'Updating...' : 'Update'}</span>
                </button>
                <button
                  onClick={closeModal}
                  disabled={isUpdating}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Username Modal */}
      {activeModal === 'username' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Change Username</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700 mb-2">
                  New Username
                </label>
                <input
                  type="text"
                  id="newUsername"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Enter new username"
                />
              </div>
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              )}
              <div className="flex items-center space-x-4 pt-4">
                <button
                  onClick={handleUpdateUsername}
                  disabled={isUpdating}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  <span>{isUpdating ? 'Updating...' : 'Update'}</span>
                </button>
                <button
                  onClick={closeModal}
                  disabled={isUpdating}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {activeModal === 'password' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Confirm new password"
                />
              </div>
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              )}
              <div className="flex items-center space-x-4 pt-4">
                <button
                  onClick={handleUpdatePassword}
                  disabled={isUpdating}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  <span>{isUpdating ? 'Updating...' : 'Update'}</span>
                </button>
                <button
                  onClick={closeModal}
                  disabled={isUpdating}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={showDeleteAccountDialog}
        onClose={() => setShowDeleteAccountDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        warningMessage="All your funds, transactions, and SIPs will be permanently deleted. This action cannot be undone. You will need to create a new account to use the platform again."
        confirmText="Delete Account"
        cancelText="Cancel"
        isLoading={isDeletingAccount}
        confirmationWord="Delete"
      />
    </div>
  );
};

export default Profile;

