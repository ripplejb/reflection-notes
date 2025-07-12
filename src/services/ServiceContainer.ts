// Service container for dependency injection following DIP
import { LocalStorageService, type IStorageService } from "./StorageService";
import { BrowserFileSystemService, type IFileSystemService } from "./FileSystemService";
import { MarkdownProcessor, type IMarkdownProcessor } from "./MarkdownProcessor";
import { ConfigurationService, type IConfigurationService } from "./ConfigurationService";

export interface IServiceContainer {
  storageService: IStorageService;
  fileSystemService: IFileSystemService;
  markdownProcessor: IMarkdownProcessor;
  configurationService: IConfigurationService;
}

export class ServiceContainer implements IServiceContainer {
  public readonly storageService: IStorageService;
  public readonly fileSystemService: IFileSystemService;
  public readonly markdownProcessor: IMarkdownProcessor;
  public readonly configurationService: IConfigurationService;

  constructor() {
    this.storageService = new LocalStorageService();
    this.fileSystemService = new BrowserFileSystemService();
    this.markdownProcessor = new MarkdownProcessor();
    this.configurationService = new ConfigurationService();
  }
}

// Singleton instance
export const serviceContainer = new ServiceContainer();
