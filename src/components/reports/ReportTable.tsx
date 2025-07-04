
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChartDataItem, PerformaCSItem } from './types';
import { getCTRColor } from './utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReportTableProps {
  activeTab: string;
  data: ChartDataItem[] | PerformaCSItem[];
  columns: string[];
}

export function ReportTable({ activeTab, data, columns }: ReportTableProps) {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role || 'cs_support';
  
  // Pagination state for kota-kabupaten table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination for kota-kabupaten
  const getPaginatedData = () => {
    if (activeTab !== 'kota-kabupaten') return data;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return (data as ChartDataItem[]).slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    if (activeTab !== 'kota-kabupaten') return 1;
    return Math.ceil(data.length / itemsPerPage);
  };

  const paginatedData = getPaginatedData();
  const totalPages = getTotalPages();

  // Special handling for Sumber Leads with Organik accordion
  if (activeTab === 'sumber-leads') {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
          <h3 className="text-lg font-semibold text-gray-900">Tabel Sumber Leads</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-left">Sumber Leads</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-center">Prospek</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-center">Leads</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-center">CTR Leads</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(data as ChartDataItem[]).map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  {item.isOrganik && item.organikBreakdown && item.organikBreakdown.length > 0 ? (
                    <td className="px-0 py-0" colSpan={4}>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="organik" className="border-none">
                          <AccordionTrigger className="hover:no-underline px-6 py-4 font-medium text-gray-900">
                            <div className="w-full flex items-center">
                              <div className="flex-1 text-left">{item.name}</div>
                              <div className="w-24 text-center text-sm">{item.prospek}</div>
                              <div className="w-24 text-center text-sm">{item.leads}</div>
                              <div className="w-24 text-center">
                                <span className={`inline-flex px-3 py-1 text-xs rounded-full justify-center ${getCTRColor(item.ctr)}`}>
                                  {item.ctr}%
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pt-0 pb-4">
                            <div className="space-y-2">
                              {item.organikBreakdown.map((breakdown, bIndex) => (
                                <div key={bIndex} className="w-full flex items-center py-2 border-b border-gray-100 last:border-b-0 pl-4">
                                  <div className="flex-1 text-sm text-gray-600">{breakdown.name}</div>
                                  <div className="w-24 text-center text-sm text-gray-700">{breakdown.prospek}</div>
                                  <div className="w-24 text-center text-sm text-gray-700">{breakdown.leads}</div>
                                  <div className="w-24 text-center">
                                    <span className={`inline-flex px-2 py-1 text-xs rounded-full justify-center ${getCTRColor(breakdown.ctr)}`}>
                                      {breakdown.ctr}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </td>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-medium">{item.prospek}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-medium">{item.leads}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getCTRColor(item.ctr)}`}>
                          {item.ctr}%
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Special handling for Kode Ads with accordion for all items
  if (activeTab === 'kode-ads') {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
          <h3 className="text-lg font-semibold text-gray-900">Tabel Kode Ads</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-left">Kode</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-center">Prospek</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-center">Leads</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-center">CTR Leads</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(data as ChartDataItem[]).map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-0 py-0" colSpan={4}>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={`kode-${index}`} className="border-none">
                        <AccordionTrigger className="hover:no-underline px-6 py-4 font-medium text-gray-900">
                          <div className="w-full flex items-center">
                            <div className="flex-1 text-left">{item.name}</div>
                            <div className="w-24 text-center text-sm">{item.prospek}</div>
                            <div className="w-24 text-center text-sm">{item.leads}</div>
                            <div className="w-24 text-center">
                              <span className={`inline-flex px-3 py-1 text-xs rounded-full justify-center ${getCTRColor(item.ctr)}`}>
                                {item.ctr}%
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pt-0 pb-4">
                          <div className="space-y-2">
                            {item.idAdsBreakdown && item.idAdsBreakdown.length > 0 ? (
                              item.idAdsBreakdown
                                .filter(breakdown => breakdown.prospek > 0)
                                .map((breakdown, bIndex) => (
                                  <div key={bIndex} className="w-full flex items-center py-2 border-b border-gray-100 last:border-b-0 pl-4">
                                    <div className="flex-1 text-sm text-gray-600">ID: {breakdown.idAds}</div>
                                    <div className="w-24 text-center text-sm text-gray-700">{breakdown.prospek}</div>
                                    <div className="w-24 text-center text-sm text-gray-700">{breakdown.leads}</div>
                                    <div className="w-24 text-center">
                                      <span className={`inline-flex px-2 py-1 text-xs rounded-full justify-center ${getCTRColor(breakdown.ctr)}`}>
                                        {breakdown.ctr}%
                                      </span>
                                    </div>
                                  </div>
                                ))
                            ) : (
                              <div className="text-sm text-gray-500 pl-4">Tidak ada rincian ID Ads</div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Regular table for other tabs
  const getTableTitle = () => {
    switch (activeTab) {
      case 'layanan-assist': return 'Tabel Layanan Assist';
      case 'kota-kabupaten': return 'Tabel Kota/Kabupaten';
      case 'performa-cs': return 'Tabel Performa CS';
      default: return 'Tabel';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
        <h3 className="text-lg font-semibold text-gray-900">{getTableTitle()}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column, index) => (
                <th key={column} className={`px-6 py-4 text-sm font-semibold text-gray-900 ${index === 0 ? 'text-left' : 'text-center'}`}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activeTab === 'performa-cs' ? (
              (paginatedData as PerformaCSItem[]).map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-medium">{item.prospek}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-medium">{item.leads}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-center font-medium">{item.bukanLeads}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getCTRColor(item.ctr)}`}>
                      {item.ctr}%
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              (paginatedData as ChartDataItem[]).map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-medium">{item.prospek}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-medium">{item.leads}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getCTRColor(item.ctr)}`}>
                      {item.ctr}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination for kota-kabupaten table */}
      {activeTab === 'kota-kabupaten' && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, data.length)} dari {data.length} data
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
