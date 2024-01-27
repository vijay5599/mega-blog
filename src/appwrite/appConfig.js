import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  database;
  bucket;
  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.database = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }
  async createPost({ title, slug, content, featuredImage, status, userid }) {
    try {
      return await this.database.createDocument(
        config.appwriteDatabseId,
        config.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userid,
        }
      );
    } catch (error) {
      console.log("Appwrite serive :: createPost :: error", error);
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.database.updateDocument(
        config.appwriteDatabseId,
        config.appwriteCollectionId,
        slug, // appwrite needs string for id
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async deletePost(slug) {
    try {
      await this.database.deleteDocument(
        config.appwriteDatabseId,
        config.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log("Delete post failed!");
      return false;
    }
  }

  async getPost(slug) {
    try {
      return await this.database.getDocument(
        config.appwriteDatabseId,
        config.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("Not found");
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.database.listDocuments(
        config.appwriteDatabseId,
        config.appwriteCollectionId,
        queries,
        0, // offset
        25 // limit
      );
    } catch (error) {
      console.log("Not found");
      return false;
    }
  }

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("upload failed", error);
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(config.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("Delete File Failed", error);
      return false;
    }
  }

  getfilePreview(fileId) {
    return this.bucket.getFilePreview(config.appwriteBucketId, fileId);
  }
}

const service = new Service();
export default service;
