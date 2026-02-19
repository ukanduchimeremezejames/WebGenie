// "use client";

// import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

export function Footer({
    return (
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white">WebGenie</div>
                  <div className="text-xs text-gray-400">Benchmarking Platform</div>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Research-grade GRN inference benchmarking and visualization
              </p>
            </div>
            
            <div>
              <h5 className="text-white mb-4">Platform</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/datasets" className="hover:text-white transition-colors">Datasets</a></li>
                <li><a href="/compare" className="hover:text-white transition-colors">Algorithms</a></li>
                <li><a href="/upload" className="hover:text-white transition-colors">Upload</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-white mb-4">Resources</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="https://github.com/Murali-group/Beeline" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="https://github.com/ukanduchimeremezejames/WebgenieDark" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-white mb-4">Subscribe</h5>
              <p className="text-sm text-gray-400 mb-2">Get updates about new datasets and algorithms</p>
              <form className="flex gap-2">
                <input type="email" placeholder="Email" className="flex-1 p-2 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm" />
                <button type="submit" className="px-4 py-2 bg-purple-600 rounded-lg text-white text-sm hover:bg-purple-700 transition-colors">Subscribe</button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 text-center text-sm">
            © 2026 WebGenie | Built on the BEELINE Platform. All rights reserved.
          </div>
        </div>
      </footer>
    );
})