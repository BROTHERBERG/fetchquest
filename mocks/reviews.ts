import { Review } from '@/types';

export const reviews: Review[] = [
  {
    id: 'review1',
    taskId: 'task9',
    reviewerId: 'user2',
    revieweeId: 'user1',
    rating: 5,
    comment: "Alex did an amazing job assembling my bookshelf! Very professional and finished faster than expected. Would definitely recommend!",
    createdAt: '2023-06-14T15:30:00Z',
  },
  {
    id: 'review2',
    taskId: 'task9',
    reviewerId: 'user1',
    revieweeId: 'user2',
    rating: 5,
    comment: "Jamie was very clear with instructions and had everything ready when I arrived. Great to work with!",
    createdAt: '2023-06-14T15:45:00Z',
  },
  {
    id: 'review3',
    taskId: 'task7',
    reviewerId: 'user4',
    revieweeId: 'user1',
    rating: 5,
    comment: "Alex delivered the meal right on time and was very kind. My neighbor called to say how much she appreciated it!",
    createdAt: '2023-06-15T19:30:00Z',
  },
  {
    id: 'review4',
    taskId: 'task7',
    reviewerId: 'user1',
    revieweeId: 'user4',
    rating: 5,
    comment: "Jordan had everything ready for pickup and gave clear directions. The task was easy to complete thanks to good preparation.",
    createdAt: '2023-06-15T19:45:00Z',
  },
];

export const getReviewsByUser = (userId: string, role: 'reviewer' | 'reviewee'): Review[] => {
  if (role === 'reviewer') {
    return reviews.filter(review => review.reviewerId === userId);
  } else {
    return reviews.filter(review => review.revieweeId === userId);
  }
};

export const getReviewsByTask = (taskId: string): Review[] => {
  return reviews.filter(review => review.taskId === taskId);
};