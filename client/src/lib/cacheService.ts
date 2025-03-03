import { User } from "@shared/schema";

const CACHE_KEY_PREFIX = "profile_cache_";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export class CacheService {
  private static encrypt(data: any): string {
    // Simple encryption for demo - in production use a proper encryption library
    return btoa(JSON.stringify(data));
  }

  private static decrypt(encryptedData: string): any {
    try {
      return JSON.parse(atob(encryptedData));
    } catch {
      return null;
    }
  }

  static getCacheKey(userId: string): string {
    return `${CACHE_KEY_PREFIX}${userId}`;
  }

  static setProfileCache(userId: string, userData: User): void {
    const cacheItem: CacheItem<User> = {
      data: userData,
      timestamp: Date.now(),
    };

    try {
      const encryptedData = this.encrypt(cacheItem);
      localStorage.setItem(this.getCacheKey(userId), encryptedData);
      console.log('Cache set successfully:', userId);
    } catch (error) {
      console.error('Cache write error:', error);
      // Clear potentially corrupted cache
      this.clearProfileCache(userId);
    }
  }

  static getProfileCache(userId: string): User | null {
    try {
      const encryptedData = localStorage.getItem(this.getCacheKey(userId));
      if (!encryptedData) {
        console.log('No cache found for user:', userId);
        return null;
      }

      const cacheItem = this.decrypt(encryptedData) as CacheItem<User>;
      if (!cacheItem) {
        console.log('Invalid cache data for user:', userId);
        return null;
      }

      // Check if cache is expired
      if (Date.now() - cacheItem.timestamp > CACHE_DURATION) {
        console.log('Cache expired for user:', userId);
        this.clearProfileCache(userId);
        return null;
      }

      console.log('Cache retrieved successfully:', userId);
      return cacheItem.data;
    } catch (error) {
      console.error('Cache read error:', error);
      this.clearProfileCache(userId);
      return null;
    }
  }

  static clearProfileCache(userId: string): void {
    try {
      localStorage.removeItem(this.getCacheKey(userId));
      console.log('Cache cleared for user:', userId);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  static updateProfileCache(userId: string, updates: Partial<User>): void {
    try {
      const currentCache = this.getProfileCache(userId);
      if (!currentCache) {
        console.log('No existing cache, creating new cache');
        this.setProfileCache(userId, updates as User);
        return;
      }

      // Merge the updates with existing data
      const updatedData = {
        ...currentCache,
        ...updates,
        // Ensure critical fields are preserved
        id: currentCache.id,
        username: currentCache.username,
        email: currentCache.email,
        emailVerified: currentCache.emailVerified,
        createdAt: currentCache.createdAt,
      };

      console.log('Updating cache with merged data:', userId);
      this.setProfileCache(userId, updatedData);
    } catch (error) {
      console.error('Cache update error:', error);
      // On error, invalidate cache to force fresh fetch
      this.clearProfileCache(userId);
    }
  }
}