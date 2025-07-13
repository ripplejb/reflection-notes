// Service container for dependency injection following DIP
import { LocalStorageService, type IStorageService } from "./StorageService";
import { BrowserFileSystemService, type IFileSystemService } from "./FileSystemService";
import { MarkdownProcessor, type IMarkdownProcessor } from "./MarkdownProcessor";
import { ConfigurationService, type IConfigurationService } from "./ConfigurationService";
import { FilterService, type IFilterService } from "./FilterService";

export interface IServiceContainer {
  storageService: IStorageService;
  fileSystemService: IFileSystemService;
  markdownProcessor: IMarkdownProcessor;
  configurationService: IConfigurationService;
  filterService: IFilterService;
}

export class ServiceContainer implements IServiceContainer {
  public readonly storageService: IStorageService;
  public readonly fileSystemService: IFileSystemService;
  public readonly markdownProcessor: IMarkdownProcessor;
  public readonly configurationService: IConfigurationService;
  public readonly filterService: IFilterService;

  constructor() {
    this.storageService = new LocalStorageService();
    this.fileSystemService = new BrowserFileSystemService();
    this.markdownProcessor = new MarkdownProcessor();
    this.configurationService = new ConfigurationService();
    this.filterService = new FilterService();
  }
}

// Singleton instance
export const serviceContainer = new ServiceContainer();
