import { User, UpdateUser } from "@shared/schema";

const STATE_KEY_PREFIX = "profile_state_";
const AUTOSAVE_INTERVAL = 5000; // 5 seconds

interface ProfileState {
  formData: Partial<UpdateUser>;
  lastModified: number;
  isDirty: boolean;
}

export class StateRecoveryService {
  private static getStateKey(userId: string): string {
    return `${STATE_KEY_PREFIX}${userId}`;
  }

  static saveState(userId: string, formData: Partial<UpdateUser>): void {
    try {
      const state: ProfileState = {
        formData,
        lastModified: Date.now(),
        isDirty: true
      };
      sessionStorage.setItem(this.getStateKey(userId), JSON.stringify(state));
      console.log('Profile state saved:', userId);
    } catch (error) {
      console.error('State save error:', error);
    }
  }

  static getState(userId: string): ProfileState | null {
    try {
      const stateData = sessionStorage.getItem(this.getStateKey(userId));
      if (!stateData) return null;

      const state = JSON.parse(stateData) as ProfileState;
      return state;
    } catch (error) {
      console.error('State recovery error:', error);
      return null;
    }
  }

  static clearState(userId: string): void {
    try {
      sessionStorage.removeItem(this.getStateKey(userId));
      console.log('Profile state cleared:', userId);
    } catch (error) {
      console.error('State clear error:', error);
    }
  }

  static hasUnsavedChanges(userId: string): boolean {
    const state = this.getState(userId);
    return state?.isDirty ?? false;
  }

  static startAutoSave(userId: string, formData: Partial<UpdateUser>): number {
    return window.setInterval(() => {
      if (userId && formData) {
        this.saveState(userId, formData);
      }
    }, AUTOSAVE_INTERVAL);
  }

  static stopAutoSave(intervalId: number): void {
    clearInterval(intervalId);
  }
}
