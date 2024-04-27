import { User } from '@auth0/auth0-react';

export interface DatabaseUser {
  id: number;
  auth0_id: string;
  name: string;
  email: string;
  balance: number;
}

export const fetchUserFromDatabase = async (auth0Id: string): Promise<DatabaseUser | null> => {
  try {
    const response = await fetch(`http://localhost:3000/users/${auth0Id}`);
    if (!response.ok) {
      return null;
    }
    const userData: DatabaseUser = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

export const createUserInDatabase = async (
  auth0Id: string,
  user: User,
): Promise<DatabaseUser> => {
  try {
    const existingUser = await fetchUserFromDatabase(auth0Id);
    if (existingUser) {
      const updatedUser = await updateUserInDatabase(auth0Id, {
        name: user.name || '',
        email: user.email || '',
      });
      return updatedUser;
    }

    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth0_id: auth0Id,
        name: user.name || '',
        email: user.email || '',
        money_balance: 0,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error('Error creating user in the database:', errorMessage);
      throw new Error(`Failed to create user in the database: ${errorMessage}`);
    }

    const newUserData: DatabaseUser = await response.json();
    return newUserData;
  } catch (error) {
    console.error('Error creating user in the database:', error);
    throw error;
  }
};

export const updateUserInDatabase = async (
  auth0Id: string,
  updatedData: Partial<DatabaseUser>
): Promise<DatabaseUser> => {
  try {
    const response = await fetch(`http://localhost:3000/users/${auth0Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error updating user in the database:', errorData);
      throw new Error(`Failed to update user in the database: ${errorData.error}`);
    }
    const updatedUserData: DatabaseUser = await response.json();
    return updatedUserData;
  } catch (error) {
    console.error('Error updating user in the database:', error);
    throw error;
  }
};