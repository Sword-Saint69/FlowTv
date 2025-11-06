'use client';

import { useState } from 'react';

export default function DeveloperSettings() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    debugMode: true,
    logLevel: 'info',
    maxConnections: 1000,
    cacheTimeout: 300,
    enableAnalytics: true,
    autoUpdate: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // In a real application, you would save these settings to a database or configuration file
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    setSettings({
      maintenanceMode: false,
      debugMode: true,
      logLevel: 'info',
      maxConnections: 1000,
      cacheTimeout: 300,
      enableAnalytics: true,
      autoUpdate: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Developer Settings</h1>
          <p className="text-gray-400">Configure system-wide settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-6">System Configuration</h2>
              
              <div className="space-y-6">
                {/* Maintenance Mode */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Maintenance Mode</h3>
                    <p className="text-sm text-gray-400">Temporarily disable user access for maintenance</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Debug Mode */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Debug Mode</h3>
                    <p className="text-sm text-gray-400">Enable detailed logging for troubleshooting</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.debugMode}
                      onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Analytics Collection</h3>
                    <p className="text-sm text-gray-400">Collect usage data for insights</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableAnalytics}
                      onChange={(e) => handleSettingChange('enableAnalytics', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Auto Update */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Auto Update</h3>
                    <p className="text-sm text-gray-400">Automatically apply system updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoUpdate}
                      onChange={(e) => handleSettingChange('autoUpdate', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Log Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Log Level
                  </label>
                  <select
                    value={settings.logLevel}
                    onChange={(e) => handleSettingChange('logLevel', e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 w-full"
                  >
                    <option value="error">Error</option>
                    <option value="warn">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                  <p className="text-sm text-gray-400 mt-1">Minimum level of logs to record</p>
                </div>

                {/* Max Connections */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Maximum Connections
                  </label>
                  <input
                    type="number"
                    value={settings.maxConnections}
                    onChange={(e) => handleSettingChange('maxConnections', parseInt(e.target.value))}
                    className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 w-full"
                    min="1"
                    max="10000"
                  />
                  <p className="text-sm text-gray-400 mt-1">Maximum concurrent user connections</p>
                </div>

                {/* Cache Timeout */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cache Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    value={settings.cacheTimeout}
                    onChange={(e) => handleSettingChange('cacheTimeout', parseInt(e.target.value))}
                    className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 w-full"
                    min="1"
                    max="3600"
                  />
                  <p className="text-sm text-gray-400 mt-1">How long to cache data before refreshing</p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-700">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  Reset to Defaults
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>

          {/* Settings Info Panel */}
          <div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
              <h2 className="text-xl font-bold mb-4">Settings Guide</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-white">Maintenance Mode</h3>
                  <p className="text-sm text-gray-400">When enabled, only developers can access the platform. Use this during updates or maintenance.</p>
                </div>
                <div>
                  <h3 className="font-medium text-white">Debug Mode</h3>
                  <p className="text-sm text-gray-400">Enables detailed logging which can help identify issues but may impact performance.</p>
                </div>
                <div>
                  <h3 className="font-medium text-white">Log Level</h3>
                  <p className="text-sm text-gray-400">Controls the verbosity of system logs. Higher levels include more detailed information.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">System Actions</h2>
              <div className="space-y-4">
                <button className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
                  <div className="font-medium text-white">Clear Cache</div>
                  <div className="text-sm text-gray-400">Remove all cached data</div>
                </button>
                <button className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
                  <div className="font-medium text-white">Restart Services</div>
                  <div className="text-sm text-gray-400">Restart all backend services</div>
                </button>
                <button className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
                  <div className="font-medium text-white">Export Logs</div>
                  <div className="text-sm text-gray-400">Download system logs for analysis</div>
                </button>
                <button className="w-full text-left p-3 bg-red-900/50 hover:bg-red-900/70 rounded-md transition-colors">
                  <div className="font-medium text-red-300">Reset All Settings</div>
                  <div className="text-sm text-red-400">Restore all settings to factory defaults</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}