
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChartDataItem, PerformaCSItem } from './types';
import { getCTRColor } from './utils';

interface ReportTableProps {
  activeTab: string;
  data: ChartDataItem[] | PerformaCSItem[];
  columns: string[];
}

export function ReportTable({ activeTab, data, columns }: ReportTableProps) {
  if (activeTab === 'heatmap') {
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
                {columns.map((column, index) => (
                  <th key={column} className={`px-6 py-4 text-sm font-semibold text-gray-900 ${index === 0 ? 'text-left' : 'text-center'}`}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(data as ChartDataItem[]).map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.isOrganik && item.organikBreakdown && item.organikBreakdown.length > 0 ? (
                      <div className="w-full">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="organik" className="border-none">
                            <AccordionTrigger className="hover:no-underline p-0 font-medium text-gray-900">
                              <div className="flex items-center justify-between w-full">
                                <span>{item.name}</span>
                                <div className="flex items-center gap-6 text-center">
                                  <span className="w-16 text-sm">{item.prospek}</span>
                                  <span className="w-16 text-sm">{item.leads}</span>
                                  <span className={`inline-flex px-3 py-1 text-xs rounded-full w-20 justify-center ${getCTRColor(item.ctr)}`}>
                                    {item.ctr}%
                                  </span>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pl-4">
                              <div className="space-y-2">
                                {item.organikBreakdown.map((breakdown, bIndex) => (
                                  <div key={bIndex} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                    <span className="text-sm text-gray-600">{breakdown.name}</span>
                                    <div className="flex items-center gap-6 text-center">
                                      <span className="w-16 text-sm text-gray-700">{breakdown.prospek}</span>
                                      <span className="w-16 text-sm text-gray-700">{breakdown.leads}</span>
                                      <span className={`inline-flex px-2 py-1 text-xs rounded-full w-20 justify-center ${getCTRColor(breakdown.ctr)}`}>
                                        {breakdown.ctr}%
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    ) : (
                      item.name
                    )}
                  </td>
                  {(!item.isOrganik || !item.organikBreakdown || item.organikBreakdown.length === 0) && (
                    <>
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

  // Special handling for Kode Ads with accordion breakdown
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
                {columns.map((column, index) => (
                  <th key={column} className={`px-6 py-4 text-sm font-semibold text-gray-900 ${index === 0 ? 'text-left' : 'text-center'}`}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(data as ChartDataItem[]).map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {item.idAdsBreakdown && item.idAdsBreakdown.length > 0 ? (
                      <div className="w-full">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value={`kode-${index}`} className="border-none">
                            <AccordionTrigger className="hover:no-underline p-0 font-medium text-gray-900">
                              <div className="grid grid-cols-4 w-full items-center">
                                <span className="text-left">{item.name}</span>
                                <span className="text-center text-sm">{item.prospek}</span>
                                <span className="text-center text-sm">{item.leads}</span>
                                <span className="text-center">
                                  <span className={`inline-flex px-3 py-1 text-xs rounded-full justify-center ${getCTRColor(item.ctr)}`}>
                                    {item.ctr}%
                                  </span>
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2">
                              <div className="space-y-2">
                                {item.idAdsBreakdown.map((breakdown, bIndex) => (
                                  <div key={bIndex} className="grid grid-cols-4 items-center py-2 border-b border-gray-100 last:border-b-0 pl-4">
                                    <span className="text-sm text-gray-600 font-medium">ID: {breakdown.idAds}</span>
                                    <span className="text-center text-sm text-gray-700">{breakdown.prospek}</span>
                                    <span className="text-center text-sm text-gray-700">{breakdown.leads}</span>
                                    <span className="text-center">
                                      <span className={`inline-flex px-2 py-1 text-xs rounded-full justify-center ${getCTRColor(breakdown.ctr)}`}>
                                        {breakdown.ctr}%
                                      </span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 w-full items-center">
                        <span className="text-left">{item.name}</span>
                        <span className="text-center text-sm font-medium">{item.prospek}</span>
                        <span className="text-center text-sm font-medium">{item.leads}</span>
                        <span className="text-center">
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getCTRColor(item.ctr)}`}>
                            {item.ctr}%
                          </span>
                        </span>
                      </div>
                    )}
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
