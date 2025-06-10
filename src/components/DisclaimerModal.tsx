import React from 'react';
import { X, Globe, FileText, Shield, ExternalLink, Database, AlertTriangle, Edit } from 'lucide-react';
import Card from './UI/Card';
import Button from './UI/Button';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <Card className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
            aria-label="Close disclaimer"
          >
            <X size={24} />
          </button>
          
          <div className="overflow-y-auto max-h-[85vh] p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
                <FileText className="text-purple-600" size={32} />
                Disclaimer - Public Domain
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Important legal information regarding the use of this web application
              </p>
            </div>

            <div className="space-y-8">
              {/* Section 1: General Use */}
              <section>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <Shield className="text-blue-600" size={20} />
                  1. General Use
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Use of this web application is at your own risk. We make no guarantees regarding the accuracy, 
                  completeness, or timeliness of the information and features provided.
                </p>
              </section>

              {/* Section 2: Availability */}
              <section>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <Globe className="text-green-600" size={20} />
                  2. Availability
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We strive to maintain uninterrupted availability of the web app. However, we cannot guarantee 
                  constant availability. Maintenance work, technical issues, or force majeure may result in 
                  temporary limitations.
                </p>
              </section>

              {/* Section 3: Data Loss */}
              <section>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <Database className="text-red-600" size={20} />
                  3. Data Loss
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We assume no liability for the loss of data or content created or stored in the web app. 
                  Users are responsible for backing up their own data.
                </p>
              </section>

              {/* Section 4: External Links */}
              <section>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <ExternalLink className="text-indigo-600" size={20} />
                  4. External Links
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  If the web app contains links to external websites, we have no control over their content. 
                  The operators of linked sites are solely responsible for their content.
                </p>
              </section>

              {/* Section 5: Limitation of Liability */}
              <section>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <AlertTriangle className="text-amber-600" size={20} />
                  5. Limitation of Liability
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Liability for damages arising from the use or non-use of the information provided, or from 
                  the use of incorrect or incomplete information, is excluded unless there is evidence of 
                  intentional or grossly negligent fault.
                </p>
              </section>

              {/* Section 6: Public Domain */}
              <section className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border-l-4 border-purple-500">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <Globe className="text-purple-600" size={20} />
                  6. Public Domain
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    This web application has been released into the Public Domain. You are free to use, copy, 
                    modify, and distribute it without permission and without attribution. The developer waives 
                    all copyright under the CC0 1.0 Universal (CC0 1.0) Public Domain Dedication.
                  </p>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-md border-l-4 border-blue-500">
                    <p className="text-sm font-medium text-gray-800 dark:text-white mb-1">
                      <strong>User-Generated Content:</strong>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Content created by users within the app remains the property of the respective users.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 7: Changes */}
              <section>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <Edit className="text-gray-600" size={20} />
                  7. Changes
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We reserve the right to modify or supplement this disclaimer at any time without notice.
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
                <Button onClick={onClose} variant="primary">
                  I Understand
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DisclaimerModal;