// Service container for dependency injection following DIP
import { LocalStorageService, type IStorageService } from "./StorageService";
import { BrowserEncryptedFileSystemService, type IEncryptedFileSystemService } from "./EncryptedFileSystemService";
import { MarkdownProcessor, type IMarkdownProcessor } from "./MarkdownProcessor";
import { ConfigurationService, type IConfigurationService } from "./ConfigurationService";
import { FilterService, type IFilterService } from "./FilterService";
import { NoteOperationsService, type INoteOperationsService } from "./NoteOperationsService";
import { WebCryptoFileEncryptionService, type IFileEncryptionService } from "./FileEncryptionService";

export interface IServiceContainer {
  storageService: IStorageService;
  fileSystemService: IEncryptedFileSystemService;
  markdownProcessor: IMarkdownProcessor;
  configurationService: IConfigurationService;
  filterService: IFilterService;
  noteOperationsService: INoteOperationsService;
  fileEncryptionService: IFileEncryptionService;
}

export class ServiceContainer implements IServiceContainer {
  public readonly storageService: IStorageService;
  public readonly fileSystemService: IEncryptedFileSystemService;
  public readonly markdownProcessor: IMarkdownProcessor;
  public readonly configurationService: IConfigurationService;
  public readonly filterService: IFilterService;
  public readonly noteOperationsService: INoteOperationsService;
  public readonly fileEncryptionService: IFileEncryptionService;

  constructor() {
    this.storageService = new LocalStorageService();
    this.markdownProcessor = new MarkdownProcessor();
    this.configurationService = new ConfigurationService();
    this.filterService = new FilterService();
    this.noteOperationsService = new NoteOperationsService();
    this.fileEncryptionService = new WebCryptoFileEncryptionService();
    this.fileSystemService = new BrowserEncryptedFileSystemService(this.fileEncryptionService);
  }
}

// Singleton instance
export const serviceContainer = new ServiceContainer();
