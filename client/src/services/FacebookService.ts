/**
 * Facebook SDK Service - Wraps Facebook SDK v2.x with Promise-based API
 * Uses the latest SDK: https://connect.facebook.net/en_US/sdk.js
 */

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

interface FacebookUser {
  id: string;
  name: string;
  email?: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

interface FacebookLoginResponse {
  authResponse: {
    accessToken: string;
    userID: string;
    expiresIn: number;
    signedRequest: string;
  };
  status: string;
}

export class FacebookService {
  private appId: string;
  private apiVersion: string = "v21.0";
  private sdkLoaded: boolean = false;

  constructor(appId: string, apiVersion: string = "v21.0") {
    this.appId = appId;
    this.apiVersion = apiVersion;
    this.initializeSDK();
  }

  /**
   * Initialize the Facebook SDK
   */
  private initializeSDK(): void {
    if (this.sdkLoaded) return;

    window.fbAsyncInit = () => {
      window.FB.init({
        appId: this.appId,
        status: true,
        cookie: true,
        xfbml: false,
        version: this.apiVersion,
      });
      this.sdkLoaded = true;
    };

    // Load the SDK if not already loaded
    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }

  /**
   * Ensure SDK is ready
   */
  private waitForSDK(): Promise<void> {
    return new Promise((resolve) => {
      if (this.sdkLoaded) {
        resolve();
        return;
      }

      const checkInterval = setInterval(() => {
        if (this.sdkLoaded) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      setTimeout(() => clearInterval(checkInterval), 10000);
    });
  }

  /**
   * Check login status
   */
  async getLoginStatus(): Promise<FacebookLoginResponse | null> {
    await this.waitForSDK();

    return new Promise((resolve) => {
      window.FB.getLoginStatus((response: FacebookLoginResponse) => {
        resolve(response.status === "connected" ? response : null);
      });
    });
  }

  /**
   * Login with Facebook
   */
  async login(permissions: string[] = ["public_profile", "email"]): Promise<FacebookLoginResponse> {
    await this.waitForSDK();

    return new Promise((resolve, reject) => {
      window.FB.login(
        (response: FacebookLoginResponse) => {
          if (response.authResponse) {
            resolve(response);
          } else {
            reject(new Error("Facebook login failed"));
          }
        },
        { scope: permissions.join(",") }
      );
    });
  }

  /**
   * Logout from Facebook
   */
  async logout(): Promise<void> {
    await this.waitForSDK();

    return new Promise((resolve) => {
      window.FB.logout(() => {
        resolve();
      });
    });
  }

  /**
   * Get current user info
   */
  async getMe(fields: string = "id,name,email,picture"): Promise<FacebookUser> {
    await this.waitForSDK();

    return new Promise((resolve, reject) => {
      window.FB.api(
        "/me",
        { fields },
        (response: any) => {
          if (!response || response.error) {
            reject(new Error(response?.error?.message || "Failed to get user info"));
          } else {
            resolve(response as FacebookUser);
          }
        }
      );
    });
  }

  /**
   * Get user friends
   */
  async getFriends(fields: string = "id,name,picture"): Promise<FacebookUser[]> {
    await this.waitForSDK();

    return new Promise((resolve, reject) => {
      window.FB.api(
        "/me/friends",
        { fields },
        (response: any) => {
          if (!response || response.error) {
            reject(new Error(response?.error?.message || "Failed to get friends"));
          } else {
            resolve(response.data as FacebookUser[]);
          }
        }
      );
    });
  }

  /**
   * Get user albums
   */
  async getAlbums(fields: string = "id,name,picture"): Promise<any[]> {
    await this.waitForSDK();

    return new Promise((resolve, reject) => {
      window.FB.api(
        "/me/albums",
        { fields },
        (response: any) => {
          if (!response || response.error) {
            reject(new Error(response?.error?.message || "Failed to get albums"));
          } else {
            resolve(response.data || []);
          }
        }
      );
    });
  }

  /**
   * Get user photos
   */
  async getPhotos(limit: number = 10): Promise<any[]> {
    await this.waitForSDK();

    return new Promise((resolve, reject) => {
      window.FB.api(
        "/me/photos",
        { limit, fields: "id,picture,source,created_time" },
        (response: any) => {
          if (!response || response.error) {
            reject(new Error(response?.error?.message || "Failed to get photos"));
          } else {
            resolve(response.data || []);
          }
        }
      );
    });
  }

  /**
   * Get user posts/feed
   */
  async getFeed(limit: number = 10): Promise<any[]> {
    await this.waitForSDK();

    return new Promise((resolve, reject) => {
      window.FB.api(
        "/me/feed",
        { limit, fields: "id,message,created_time,type,story" },
        (response: any) => {
          if (!response || response.error) {
            reject(new Error(response?.error?.message || "Failed to get feed"));
          } else {
            resolve(response.data || []);
          }
        }
      );
    });
  }

  /**
   * Generic API call wrapper
   */
  async apiCall(path: string, params: any = {}, method: string = "GET"): Promise<any> {
    await this.waitForSDK();

    return new Promise((resolve, reject) => {
      window.FB.api(
        path,
        method,
        params,
        (response: any) => {
          if (!response || response.error) {
            reject(new Error(response?.error?.message || `API call failed: ${path}`));
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  /**
   * Share content on Facebook
   */
  async share(url: string, quote?: string): Promise<any> {
    await this.waitForSDK();

    return new Promise((resolve, reject) => {
      window.FB.ui(
        {
          method: "share",
          href: url,
          ...(quote && { quote }),
        },
        (response: any) => {
          if (!response || response.error_code) {
            reject(new Error("Share failed"));
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  /**
   * Send dialog (for sending messages)
   */
  async sendDialog(to: string, link: string): Promise<any> {
    await this.waitForSDK();

    return new Promise((resolve, reject) => {
      window.FB.ui(
        {
          method: "send",
          link,
          to,
        },
        (response: any) => {
          if (!response || response.error_code) {
            reject(new Error("Send failed"));
          } else {
            resolve(response);
          }
        }
      );
    });
  }
}

// Singleton instance
let facebookServiceInstance: FacebookService | null = null;

export function initializeFacebookService(appId: string, apiVersion?: string): FacebookService {
  if (!facebookServiceInstance) {
    facebookServiceInstance = new FacebookService(appId, apiVersion);
  }
  return facebookServiceInstance;
}

export function getFacebookService(): FacebookService {
  if (!facebookServiceInstance) {
    throw new Error("Facebook service not initialized. Call initializeFacebookService first.");
  }
  return facebookServiceInstance;
}
