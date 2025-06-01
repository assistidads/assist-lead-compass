import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChartDataItem, PerformaCSItem } from './types';
import { getCTRColor } from './utils';
import { useAuth } from '@/contexts/AuthContext';

interface ReportTableProps {
  activeTab: string;
  data: ChartDataItem[] | PerformaCSItem[];
  columns: string[];
}

export function ReportTable({ activeTab, data, columns }: ReportTableProps) {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role || 'cs_support';

  if (activeTab === 'heatmap') {
    // Only admin can see heatmap
    if (userRole !== 'admin') {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center text-gray-500">
            <p>Akses terbatas untuk admin</p>
          </div>
        </div>
      );
    }
    return null;
  }

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
                        {item.idAdsBreakdown && item.idAdsBreakdown.length > 0 && (
                          <AccordionContent className="px-6 pt-0 pb-4">
                            <div className="space-y-2">
                              {item.idAdsBreakdown
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
                                ))}
                            </div>
                          </AccordionContent>
                        )}
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
              (data as PerformaCSItem[]).map((item, index) => (
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
              (data as ChartDataItem[]).map((item, index) => (
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
    </div>
  );
}
