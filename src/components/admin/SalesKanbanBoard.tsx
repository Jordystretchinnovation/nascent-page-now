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
    title: 'Te Contacteren',
    color: 'border-orange-200 bg-orange-50',
    headerColor: 'bg-orange-100'
  },
  {
    id: 'gecontacteerd',
    title: 'Gecontacteerd',
    color: 'border-blue-200 bg-blue-50',
    headerColor: 'bg-blue-100'
  },
  {
    id: 'gesprek_gepland',
    title: 'Gesprek Gepland',
    color: 'border-amber-200 bg-amber-50',
    headerColor: 'bg-amber-100'
  },
  {
    id: 'afgewezen',
    title: 'Afgewezen',
    color: 'border-gray-200 bg-gray-50',
    headerColor: 'bg-gray-100'
  },
  {
    id: 'niet_relevant',
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
  const getSubmissionsByStatus = (status: string) => {
    return submissions.filter(submission => {
      const salesStatus = submission.sales_status || 'te_contacteren';
      return salesStatus === status;
    });
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      return;
    }

    await onStatusUpdate(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {salesStatuses.map((status) => {
          const statusSubmissions = getSubmissionsByStatus(status.id);
          
          return (
            <Card key={status.id} className={`${status.color} min-h-[600px]`}>
              <CardHeader className={`${status.headerColor} rounded-t-lg`}>
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  {status.title}
                  <span className="bg-white rounded-full px-2 py-1 text-xs font-bold">
                    {statusSubmissions.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <Droppable droppableId={status.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[500px] rounded-md ${
                        snapshot.isDraggingOver ? 'bg-white/50' : ''
                      }`}
                    >
                      <div className="space-y-3">
                        {statusSubmissions.map((submission, index) => (
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