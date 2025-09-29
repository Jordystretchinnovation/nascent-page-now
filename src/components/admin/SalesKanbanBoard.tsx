import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeadCard } from './LeadCard';

interface FormSubmission {
  id: string;
  type: string;
  voornaam: string;
  achternaam: string;
  bedrijf: string;
  email: string;
  telefoon: string | null;
  straat: string | null;
  postcode: string | null;
  gemeente: string | null;
  renderbook_type: string | null;
  kwaliteit: string | null;
  marketing_optin: boolean;
  language: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  created_at: string;
  sales_status: string | null;
  sales_rep: string | null;
  sales_comment: string | null;
  toelichting: string | null;
}

interface SalesKanbanBoardProps {
  submissions: FormSubmission[];
  onStatusUpdate: (id: string, newStatus: string) => Promise<void>;
  onLeadClick: (lead: FormSubmission) => void;
}

const salesStatuses = [
  {
    id: 'te_contacteren',
    dbValue: 'te_contacteren', // This one stays lowercase as it's the default
    title: 'Te Contacteren',
    color: 'border-orange-200 bg-orange-50',
    headerColor: 'bg-orange-100'
  },
  {
    id: 'gecontacteerd',
    dbValue: 'Gecontacteerd', // Capitalized to match database
    title: 'Gecontacteerd',
    color: 'border-blue-200 bg-blue-50',
    headerColor: 'bg-blue-100'
  },
  {
    id: 'gesprek_gepland',
    dbValue: 'Gesprek gepland', // Fixed: use space instead of underscore
    title: 'Gesprek Gepland',
    color: 'border-amber-200 bg-amber-50',
    headerColor: 'bg-amber-100'
  },
  {
    id: 'afgewezen',
    dbValue: 'Afgewezen', // Capitalized to match database
    title: 'Afgewezen',
    color: 'border-gray-200 bg-gray-50',
    headerColor: 'bg-gray-100'
  },
  {
    id: 'niet_relevant',
    dbValue: 'Niet relevant', // Fixed: use space instead of underscore
    title: 'Niet Relevant',
    color: 'border-slate-200 bg-slate-50',
    headerColor: 'bg-slate-100'
  }
];

export const SalesKanbanBoard: React.FC<SalesKanbanBoardProps> = ({
  submissions,
  onStatusUpdate,
  onLeadClick
}) => {
  const getSubmissionsByStatus = (statusId: string) => {
    // Find the correct database value for this status
    const statusConfig = salesStatuses.find(s => s.id === statusId);
    const dbValue = statusConfig?.dbValue || statusId;
    
    const allSubmissions = submissions.filter(submission => {
      const salesStatus = submission.sales_status || 'te_contacteren';
      return salesStatus === dbValue;
    });
    // Return both limited and total count
    return {
      displayed: allSubmissions.slice(0, 20),
      total: allSubmissions.length,
      hasMore: allSubmissions.length > 20
    };
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      return;
    }

    // Find the correct database value for the destination status
    const statusConfig = salesStatuses.find(s => s.id === destination.droppableId);
    const dbValue = statusConfig?.dbValue || destination.droppableId;

    await onStatusUpdate(draggableId, dbValue);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {salesStatuses.map((status) => {
          const statusData = getSubmissionsByStatus(status.id);
          
          return (
            <Card key={status.id} className={`${status.color} h-[600px] flex flex-col`}>
              <CardHeader className={`${status.headerColor} rounded-t-lg flex-shrink-0`}>
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  {status.title}
                  <span className="bg-white rounded-full px-2 py-1 text-xs font-bold">
                    {statusData.total}
                    {statusData.hasMore && (
                      <span className="text-orange-600 ml-1">*</span>
                    )}
                  </span>
                </CardTitle>
                {statusData.hasMore && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Toont eerste 20 van {statusData.total} leads
                  </p>
                )}
              </CardHeader>
              <CardContent className="p-3 flex-1 overflow-hidden">
                <Droppable droppableId={status.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`h-full rounded-md overflow-y-auto ${
                        snapshot.isDraggingOver ? 'bg-white/50' : ''
                      }`}
                      style={{ 
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#cbd5e1 transparent'
                      }}
                    >
                      <div className="space-y-3 pb-4">
                        {statusData.displayed.map((submission, index) => (
                          <Draggable
                            key={submission.id}
                            draggableId={submission.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${
                                  snapshot.isDragging ? 'transform rotate-2' : ''
                                }`}
                              >
                                <LeadCard
                                  submission={submission}
                                  onClick={() => onLeadClick(submission)}
                                  isDragging={snapshot.isDragging}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {statusData.hasMore && (
                          <div className="p-3 bg-white/60 rounded-lg border-2 border-dashed border-gray-300 text-center">
                            <p className="text-sm text-muted-foreground">
                              +{statusData.total - 20} meer leads...
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Gebruik filters om minder leads te tonen
                            </p>
                          </div>
                        )}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DragDropContext>
  );
};