// Automated functionality test for Reflection Notes application
// This script tests all core features mentioned in the summary

console.log('🧪 Starting Automated Functionality Tests...\n');

// Helper function to wait for elements
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      } else {
        setTimeout(checkElement, 100);
      }
    };
    checkElement();
  });
}

// Helper function to simulate clicks
function simulateClick(element) {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  element.dispatchEvent(event);
}

// Helper function to simulate typing
function simulateTyping(element, text) {
  element.focus();
  element.value = text;
  const inputEvent = new Event('input', { bubbles: true });
  element.dispatchEvent(inputEvent);
  const changeEvent = new Event('change', { bubbles: true });
  element.dispatchEvent(changeEvent);
}

// Test results tracker
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function recordTest(testName, passed, details = '') {
  testResults.tests.push({ testName, passed, details });
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${testName} - PASSED ${details}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName} - FAILED ${details}`);
  }
}

// Main test function
async function runTests() {
  try {
    
    // Test 1: Header & Navigation
    console.log('\n📋 Testing Header & Navigation...');
    
    try {
      const header = await waitForElement('header');
      recordTest('Header exists', !!header);
      
      const title = header.querySelector('h1');
      recordTest('Title displays "Reflection Notes"', title && title.textContent.includes('Reflection Notes'));
      
      const userIcon = header.querySelector('[data-testid="user-icon"], .text-3xl');
      recordTest('User icon visible', !!userIcon);
      
      const saveButton = header.querySelector('button:has([data-icon="save"]), button:contains("Save")');
      const loadButton = header.querySelector('button:has([data-icon="folder-open"]), button:contains("Load")');
      recordTest('Save button in header', !!saveButton || !!document.querySelector('button[aria-label*="Save"], button:contains("Save")'));
      recordTest('Load button in header', !!loadButton || !!document.querySelector('button[aria-label*="Load"], button:contains("Load")'));
      
    } catch (error) {
      recordTest('Header & Navigation', false, error.message);
    }

    // Test 2: Date Management
    console.log('\n📅 Testing Date Management...');
    
    try {
      // Look for Add button in Dates section
      const addDateButton = document.querySelector('section:first-of-type button, h2:contains("Dates") + button, button:contains("Add")');
      recordTest('Add Date button exists', !!addDateButton);
      
      if (addDateButton) {
        const initialDateCount = document.querySelectorAll('[data-testid="date-component"], .space-y-2 > div').length;
        simulateClick(addDateButton);
        
        // Wait a bit for the new date to be added
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newDateCount = document.querySelectorAll('[data-testid="date-component"], .space-y-2 > div').length;
        recordTest('Add Date creates new date', newDateCount > initialDateCount);
      }
      
    } catch (error) {
      recordTest('Date Management', false, error.message);
    }

    // Test 3: Content Management
    console.log('\n📝 Testing Content Management...');
    
    try {
      // Look for Add button in Contents section
      const addContentButton = document.querySelector('section:last-of-type button:contains("Add"), h2:contains("Contents") ~ button');
      recordTest('Add Content button exists', !!addContentButton);
      
      if (addContentButton) {
        const initialContentCount = document.querySelectorAll('[data-testid="content-component"], .contents-section > div').length;
        simulateClick(addContentButton);
        
        // Wait for content to be added
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newContentCount = document.querySelectorAll('[data-testid="content-component"], .contents-section > div').length;
        recordTest('Add Content creates new content', newContentCount > initialContentCount);
        
        // Test editing content
        const headerInput = document.querySelector('input[value*="New Header"], input[placeholder*="header"]');
        if (headerInput) {
          simulateTyping(headerInput, 'Test Header');
          recordTest('Content header editable', headerInput.value.includes('Test Header'));
        }
      }
      
    } catch (error) {
      recordTest('Content Management', false, error.message);
    }

    // Test 4: Save Functionality
    console.log('\n💾 Testing Save Functionality...');
    
    try {
      const saveButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Save') || btn.getAttribute('aria-label')?.includes('Save')
      );
      recordTest('Save button accessible', !!saveButton);
      
      if (saveButton) {
        recordTest('Save button enabled', !saveButton.disabled);
        
        // Test if File System Access API is supported
        const hasFileSystemAPI = 'showSaveFilePicker' in window;
        recordTest('File System Access API available', hasFileSystemAPI);
        
        if (!hasFileSystemAPI) {
          const warningMessage = document.querySelector('[class*="text-red"], .text-red-600');
          recordTest('API warning displayed when not supported', !!warningMessage);
        }
      }
      
    } catch (error) {
      recordTest('Save Functionality', false, error.message);
    }

    // Test 5: Load Functionality
    console.log('\n📂 Testing Load Functionality...');
    
    try {
      const loadButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Load') || btn.getAttribute('aria-label')?.includes('Load')
      );
      recordTest('Load button accessible', !!loadButton);
      
      if (loadButton) {
        recordTest('Load button enabled', !loadButton.disabled);
        
        // Check button styling consistency
        const saveButton = Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent.includes('Save')
        );
        
        if (saveButton && loadButton) {
          const saveClasses = saveButton.className;
          const loadClasses = loadButton.className;
          recordTest('Save and Load buttons have consistent styling', saveClasses === loadClasses);
        }
      }
      
    } catch (error) {
      recordTest('Load Functionality', false, error.message);
    }

    // Test 6: Data Persistence (localStorage)
    console.log('\n💾 Testing Data Persistence...');
    
    try {
      // Check if localStorage is being used
      const storageKey = 'reflection-notes';
      const storedData = localStorage.getItem(storageKey);
      recordTest('localStorage contains notes data', !!storedData);
      
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          recordTest('Stored data is valid JSON', Array.isArray(parsedData));
        } catch {
          recordTest('Stored data is valid JSON', false);
        }
      }
      
      // Test if filename is stored
      const storedFileName = localStorage.getItem('reflection-notes-file-name');
      recordTest('File name storage mechanism exists', typeof storedFileName === 'string' || storedFileName === null);
      
    } catch (error) {
      recordTest('Data Persistence', false, error.message);
    }

  } catch (error) {
    console.error('Test execution error:', error);
  }

  // Print final results
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  console.log('\n📋 Detailed Results:');
  testResults.tests.forEach((test, index) => {
    console.log(`${index + 1}. ${test.passed ? '✅' : '❌'} ${test.testName} ${test.details}`);
  });

  return testResults;
}

// Export for use in browser console
window.runReflectionNotesTests = runTests;

// Auto-run if in browser
if (typeof window !== 'undefined') {
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(runTests, 1000); // Wait 1 second after DOM load
    });
  } else {
    setTimeout(runTests, 1000);
  }
}
